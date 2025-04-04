const AppError = require("../../utils/AppError");

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
}

module.exports = CreateArticle;
