const express = require("express");
const { authMiddleware } = require("../middlewares/AuthMiddleware");
const MongoViewWebsiteRepository = require("../repositories/mongo/MongoViewWebsiteRepository");
const ViewWebsiteController = require("../controller/ViewWebsiteController");

const ViewWebsiteRoutes = () => {
  const router = express.Router();

  const viewWebsiteRepository = new MongoViewWebsiteRepository();
  const viewWebsiteController = new ViewWebsiteController(viewWebsiteRepository);

  router.put("/", (req, res) => {
    viewWebsiteController.updateViewWebsite(req, res);
  });

  router.post("/:year", authMiddleware, (req, res) => viewWebsiteController.getAllViewWebsiteStatisticByYear(req, res));

  return router;
};

module.exports = ViewWebsiteRoutes;
