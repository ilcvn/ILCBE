const {
  CreateArticleUsecase,
  UpdateArticleUsecase,
  DeleteArticleUsecase,
  GetArticleUsecase,
} = require("../usecases");
const sendResponse = require("../utils/Response");
const sendError = require("../utils/HandleError");
const AppError = require("../utils/AppError");

class ArticleController {
  constructor(articleRepository, interactedArticleRepository) {
    this.createArticleUsecase = new CreateArticleUsecase(articleRepository, interactedArticleRepository);
    this.updateArticleUsecase = new UpdateArticleUsecase(articleRepository, interactedArticleRepository);
    this.deleteArticleUseCase = new DeleteArticleUsecase(articleRepository, interactedArticleRepository);
    this.getArticleUseCase = new GetArticleUsecase(articleRepository, interactedArticleRepository);
  }

  // create
  async createArticle(req, res) {
    try {
      const articleData = req.body;

      if (
        !articleData.title ||
        !articleData.summary ||
        !articleData.type ||
        !articleData.content
      ) {
        throw new AppError(
          "All fields (title, summary, preview_img, type, content) are required.",
          400
        );
      }

      await this.createArticleUsecase.executed(articleData);

      sendResponse(res, 201, "Create article success!", "success", null);
    } catch (error) {
      sendError(res, error);
    }
  }

  // udpate
  async udpateArticle(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      if (!id) {
        throw new AppError("Id are required.", 400);
      }
      if (!updateData) {
        throw new AppError("Notthing to update", 400);
      }

      await this.updateArticleUsecase.executed(id, updateData);

      sendResponse(res, 200, "Update article success", null);
    } catch (error) {
      console.log(error);
      sendError(res, error);
    }
  }

  //delete
  async deleteArticle(req, res) {
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

  // get
  async getArticleDetail(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        throw new AppError("Id are required.", 400);
      }
      const article = await this.getArticleUseCase.getArticleById(id);

      const responeData = {
        id: article.id,
        title: article.title,
        preview_img: article.preview_img,
        type: article.type,
        language: article.language,
        summary: article.summary,
        content: article.content,
        view: article.views,
        createDate: article.createDate,
        interactedArticles: article.interactedArticles,
      };

      sendResponse(res, 200, "get detail success", "success", responeData);
    } catch (error) {
      sendError(res, error);
    }
  }

  // search
  async dynamicSearch(req, res) {
    try {
      const { page = 1, limit = 20, ...query } = req.query;
      const articles = await this.getArticleUseCase.searchArticle(
        page,
        limit,
        query
      );
      sendResponse(res, 200, "find success", "success", articles);
    } catch (error) {
      console.error("fail", error);
      this.handleError(res, error);
    }
  }

  async getAllArticleStatisticByYear(req, res) {
      try {
        const {year} = req.params;
        const statistic = await this.getArticleUseCase.getAllArticleStatisticByYear(year);
        const responseData = statistic
  
        sendResponse(res, 200, "Get statistic success", "success", responseData);
      } catch (error) {
        sendError(res, error);
      }
    }

  async translateArticle(req, res) {
    try {
      const { id, language } = req.params;

      const rs = await this.createArticleUsecase.translateArticle(id, language);

      sendResponse(res, 201, "translate success", "success", rs);
    } catch (error) {
      sendError(res, error);
    }
  }
}

module.exports = ArticleController;
