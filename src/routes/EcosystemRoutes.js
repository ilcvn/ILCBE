const express = require("express");
const { authMiddleware } = require("../middlewares/AuthMiddleware");
const MongoEcosystemRepository = require("../repositories/mongo/MongoEcosystemRepository");
const EcosystemController = require("../controller/EcosystemController");

const EcosystemRoutes = () => {
  const router = express.Router();

  const ecosystemRepository = new MongoEcosystemRepository();
  const ecosystemController = new EcosystemController(ecosystemRepository);

  router.post("/", authMiddleware, (req, res) => {
    ecosystemController.createEcosystem(req, res);
  });

  router.put("/:id", authMiddleware, (req, res) => {
    ecosystemController.updateEcosystem(req, res);
  });

  router.delete("/:id", authMiddleware, (req, res) => {
    ecosystemController.deleteEcosystem(req, res);
  });

  router.get("/:id", (req, res) => {
    ecosystemController.getEcosystemDetail(req, res);
  });

  router.get("/", (req, res) => ecosystemController.dynamicSearch(req, res));

  return router;
};

module.exports = EcosystemRoutes;
