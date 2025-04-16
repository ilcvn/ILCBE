const AppError = require("../../utils/AppError");
const translate = require("google-translate-api-x");
const cheerio = require("cheerio");

class CreateArticle {
  constructor(articleRepository) {
    this.articleRepository = articleRepository;
  }

  async executed(data) {
    const lastID = await this.articleRepository.getLastId();
    const newId = lastID + 1;

    const article = {
      ...data,
      id: newId,
      views: 0,
    };

    const existingArticle = await this.articleRepository.findByTitle(
      data.title
    );

    if (existingArticle) {
      throw new AppError(
        "Tên bài viết này đã trùng với bài đăng trước đó",
        400
      );
    }

    const createdArticle = await this.articleRepository.create(article);
    return createdArticle;
  }

  async translateText(
    text,
    fromLang = "vi",
    toLang = "zh-CN",
    format = "plain"
  ) {
    try {
      const lines = text.split("\n");

      const translatedLines = await Promise.all(
        lines.map(async (line) => {
          if (line.trim() === "") return "";
          const result = await translate(line, { from: fromLang, to: toLang });
          return result.text;
        })
      );

      const resultText = translatedLines.join("\n");

      if (format === "html") {
        return resultText.replace(/\n/g, "<br>");
      }
      return resultText;
    } catch (error) {
      console.error("Translation error:", error);
      throw error;
    }
  }

  async translateHTML(htmlContent, fromLang = "vi", toLang = "zh-CN") {
    const $ = cheerio.load(htmlContent);

    const elements = $("*"); // Các phần tử cần dịch trong HTML

    for (let i = 0; i < elements.length; i++) {
      const elem = elements[i];

      if ($(elem).children().length === 0) {
        const originalText = $(elem).text().trim();
        if (originalText) {
          try {
            const translated = await translate(originalText, {
              from: fromLang,
              to: toLang,
            });
            $(elem).text(translated.text);
          } catch (err) {
            console.error("Error:", err);
          }
        }
      } else {
        $(elem)
          .contents()
          .each(async (index, child) => {
            if (child.type === "text") {
              const originalText = child.data.trim();
              if (originalText) {
                try {
                  const translated = await translate(originalText, {
                    from: fromLang,
                    to: toLang,
                  });
                  child.data = translated.text;
                } catch (err) {
                  console.error("Error:", err);
                }
              }
            }
          });
      }
    }

    $("img").each(async (index, img) => {
      const altText = $(img).attr("alt");
      if (altText) {
        try {
          const translatedAlt = await translate(altText, {
            from: fromLang,
            to: toLang,
          });
          $(img).attr("alt", translatedAlt.text); // Thay thế thuộc tính alt đã dịch
        } catch (err) {
          console.error("Error:", err);
        }
      }
    });

    // Trả lại HTML đã dịch
    let translatedHtml = $.html();

    // Loại bỏ thẻ <html>, <head>, và <body> bằng cách sử dụng string.replace()
    translatedHtml = translatedHtml
      .replace(/<\/?html>/g, "")
      .replace(/<\/?head>/g, "")
      .replace(/<\/?body>/g, "");

    return translatedHtml;
  }

  async translateArticle(id, language) {
    const article = await this.articleRepository.findById(id);
    if (!article) {
      throw new AppError("Article does not exist", 404);
    }

    const lastID = await this.articleRepository.getLastId();
    const newId = lastID + 1;

    const toLanguage =
      language !== "ZH"
        ? language.toLowerCase()
        : language.toLowerCase() + "-CN";

    const newArticle = {
      id: newId,
      title: await this.translateText(article.title, "vi", toLanguage),
      preview_img: article.preview_img,
      type: article.type,
      language: language,
      summary: await this.translateText(article.summary, "vi", toLanguage),
      content: await this.translateHTML(article.content, "vi", toLanguage),
      views: 0,
      createDate: Date.now(),
      updateDate: Date.now(),
    };

    const createdArticle = await this.articleRepository.create(newArticle);
    return createdArticle;
  } 
}

module.exports = CreateArticle;
