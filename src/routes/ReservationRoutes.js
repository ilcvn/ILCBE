const express = require("express");
const { authMiddleware } = require("../middlewares/AuthMiddleware");
const MongoReservationRepository = require("../repositories/mongo/MongoReservationRepository");
const ReservationController = require("../controller/ReservationController");

const ReservationRoutes = () => {
  const router = express.Router();

  const reservationRepository = new MongoReservationRepository();
  const reservationController = new ReservationController(
    reservationRepository
  );

  router.post("/", (req, res) => {
    reservationController.createReservation(req, res);
  });

  router.put("/:id", authMiddleware, (req, res) => {
    reservationController.updateReservation(req, res);
  });

  router.delete("/:id", authMiddleware, (req, res) => {
    reservationController.deleteReservation(req, res);
  });

  router.get("/:id", authMiddleware, (req, res) => {
    reservationController.getReservationDetail(req, res);
  });

  router.get("/", authMiddleware, (req, res) =>
    reservationController.dynamicSearch(req, res)
  );

  router.get("/recently/top5Pending", authMiddleware, (req, res) => {
    reservationController.get5NewestPendingReservation(req, res);
  });

  router.post("/statistic/:year", authMiddleware, (req, res) => reservationController.getAllReservationStatisticByYear(req, res));

  return router;
};

module.exports = ReservationRoutes;
