const AppError = require("../../utils/AppError");

class DeleteArticle {
  constructor(articleRepository) {
    this.articleRepository = articleRepository;
  }

  async executed(id) {
    const existingArticle = await this.articleRepository.findById(id);

    if (!existingArticle) {
      throw new AppError("Article does not exist", 404);
    }

    const result = await this.articleRepository.delete(id);
    return result;
  }
}

module.exports = DeleteArticle;
