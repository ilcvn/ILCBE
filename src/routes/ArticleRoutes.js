const express = require("express");
const { authMiddleware } = require("../middlewares/AuthMiddleware");
const MongoArticleRepository = require("../repositories/mongo/MongoArticleRepository");
const ArticleController = require("../controller/ArticleController");

const ArticleRoutes = () => {
  const router = express.Router();

  const articleRepository = new MongoArticleRepository();
  const articleController = new ArticleController(articleRepository);

  router.post("/", authMiddleware, (req, res) => {
    articleController.createArticle(req, res);
  });

  router.put("/:id", authMiddleware, (req, res) => {
    articleController.udpateArticle(req, res);
  });

  router.delete("/:id", authMiddleware, (req, res) => {
    articleController.deleteArticle(req, res);
  });

  router.get("/:id", (req, res) => {
    articleController.getArticleDetail(req, res);
  });

  router.get("/", (req, res) => articleController.dynamicSearch(req, res));

  router.post("/statistic/:year", authMiddleware, (req, res) =>
    articleController.getAllArticleStatisticByYear(req, res)
  );

  return router;
};

module.exports = ArticleRoutes;
