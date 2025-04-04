const express = require("express");
const { authMiddleware } = require("../middlewares/AuthMiddleware");
const MongoViewWebsiteRepository = require("../repositories/mongo/MongoViewWebsiteRepository");
const MongoReservationRepository = require("../repositories/mongo/MongoReservationRepository");
const CompoundController = require("../controller/CompoundController");

const CompoundRoutes = () => {
  const router = express.Router();

  const reservationRepository = new MongoReservationRepository();
  const viewWebisteRepository = new MongoViewWebsiteRepository();
  const compoundController = new CompoundController(reservationRepository, viewWebisteRepository);

  router.post("/", authMiddleware, (req, res) => compoundController.getAllDashboardStatisticToday(req, res));

  return router;
};

module.exports = CompoundRoutes;
