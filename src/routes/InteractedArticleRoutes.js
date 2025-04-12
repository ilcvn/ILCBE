const express = require("express");
const { authMiddleware } = require("../middlewares/AuthMiddleware");
const MongoInteractedArticleRepository = require("../repositories/mongo/MongoInteractedArticleRepository");
const InteractedArticleController = require("../controller/InteractedArticleController");

const InteractedArticleRoutes = () => {
  const router = express.Router();

  const interactedArticleRepository = new MongoInteractedArticleRepository();

  const interactedArticleController = new InteractedArticleController(interactedArticleRepository);

  router.post("/", authMiddleware, (req, res) => {
    interactedArticleController.createInteractedArticle(req, res);
  });

  router.delete("/:id", authMiddleware, (req, res) => {
    interactedArticleController.deleteInteractedArticle(req, res);
  });

  return router;
};

module.exports = InteractedArticleRoutes;
