const translate = require("google-translate-api-x");
const cheerio = require("cheerio");

class Translator {
    static async translateText(
        text,
        fromLang,
        toLang,
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

    static async translateHTML(htmlContent, fromLang, toLang) {
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
}

module.exports = Translator;