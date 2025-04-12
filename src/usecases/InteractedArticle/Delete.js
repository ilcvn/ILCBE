const AppError = require("../../utils/AppError");

class DeleteInteractedArticle {
  constructor(interactedArticleRepository) {
    this.interactedArticleRepository = interactedArticleRepository;
  }

  async executed(id) {
    const existingArticle = await this.interactedArticleRepository.findById(id);

    if (!existingArticle) {
      throw new AppError("Article does not exist", 404);
    }

    const result = await this.interactedArticleRepository.delete(id);
    return result;
  }
}

module.exports = DeleteInteractedArticle;
