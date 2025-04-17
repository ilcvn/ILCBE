const AppError = require("../../utils/AppError");
const Translator = require("../../utils/Translator");

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

  async translateArticle(id, fromLanguage, toLanguage) {
    const article = await this.articleRepository.findById(id);
    if (!article) {
      throw new AppError("Article does not exist", 404);
    }

    const lastID = await this.articleRepository.getLastId();
    const newId = lastID + 1;

    const translateFromLanguage =
    fromLanguage !== "ZH"
        ? fromLanguage.toLowerCase()
        : fromLanguage.toLowerCase() + "-CN";
    
    const translateToLanguage =
    toLanguage !== "ZH"
        ? toLanguage.toLowerCase()
        : toLanguage.toLowerCase() + "-CN";

    const newArticle = {
      id: newId,
      title: await Translator.translateText(article.title, translateFromLanguage, translateToLanguage),
      preview_img: article.preview_img,
      type: article.type,
      language: toLanguage,
      summary: await Translator.translateText(article.summary, translateFromLanguage, translateToLanguage),
      content: await Translator.translateHTML(article.content, translateFromLanguage, translateToLanguage),
      views: 0,
      createDate: Date.now(),
      updateDate: Date.now(),
    };

    const createdArticle = await this.articleRepository.create(newArticle);
    return createdArticle;
  } 
}

module.exports = CreateArticle;
