const {
  CreateInteractedArticle,
  DeleteInteractedArticle,

} = require("../usecases");
const sendResponse = require("../utils/Response");
const sendError = require("../utils/HandleError");
const AppError = require("../utils/AppError");

class InteractedArticleController {
  constructor(interactedArticleRepository) {
    this.createInteractedArticleUsecase = new CreateArticleUsecase(interactedArticleRepository);
    this.deleteInteractedArticleUsecase = new DeleteArticleUsecase(interactedArticleRepository);
  }

  // create
  async createInteractedArticle(req, res) {
    try {
      const interactedArticleData = req.body;

      if (
        !interactedArticleData.type ||
        !interactedArticleData.value ||
        !interactedArticleData.articleID
      ) {
        throw new AppError(
          "All fields (type, value, articleID) are required.",
          400
        );
      }

      await this.createArticleUsecase.executed(articleData);

      sendResponse(res, 201, "Create article success!", "success", null);
    } catch (error) {
      sendError(res, error);
    }
  }

  //delete
  async deleteCreatedArticle(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        throw new AppError("Id are required.", 400);
      }
      await this.deleteArticleUseCase.executed(id);
      sendResponse(res, 200, "Delete article success", "success", null);
    } catch (error) {
      sendError(res, error);
    }
  }
}

module.exports = InteractedArticleController;
