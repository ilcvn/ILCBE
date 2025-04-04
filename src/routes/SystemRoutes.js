const express = require("express");
const { authMiddleware } = require("../middlewares/AuthMiddleware");
const MongoSystemRepository = require("../repositories/mongo/MongoSystemRepository");
const SystemController = require("../controller/SystemController");

const SystemRoutes = () => {
  const router = express.Router();

  const systemRepository = new MongoSystemRepository();
  const systemController = new SystemController(systemRepository);

  router.put("/", authMiddleware, (req, res) => {
    systemController.updateSystem(req, res);
  });

  router.get("/", (req, res) => systemController.getSystemDetail(req, res));

  return router;
};

module.exports = SystemRoutes;
