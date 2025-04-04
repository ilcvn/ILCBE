const AppError = require("../../utils/AppError");

class UpdateArticle {
  constructor(articleRepository) {
    this.articleRepository = articleRepository;
  }

  async executed(id, updateData) {
    const existingArticle = await this.articleRepository.findById(id);

    if (!existingArticle) {
      throw new AppError("Article does not exist", 404);
    }

    delete updateData.id;

    const updatedarticle = await this.articleRepository.update(id, updateData);
    return updatedarticle;
  }
}

module.exports = UpdateArticle;
