const express = require("express");
const cors = require("cors");
const AccountRoutes = require("../routes/AccountRoutes");
const InteractedArticleRoutes = require("../routes/InteractedArticleRoutes");
const ArticleRoutes = require("../routes/ArticleRoutes");
const MemberRoutes = require("../routes/MemberRoutes");
const SystemRoutes = require("../routes/SystemRoutes");
const ReservationRoutes = require("../routes/ReservationRoutes");
const EcosystemRoutes = require("../routes/EcosystemRoutes")
const ViewWebsiteRoutes = require("../routes/ViewWebsiteRoutes")
const CompoundRoutes = require("../routes/CompoundRoutes")

module.exports = () => {
  const app = express();
  app.use(express.json());

  app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    })
  );

  app.use("/api/account", AccountRoutes());
  app.use("/api/article", ArticleRoutes());
  app.use("/api/interactedArticle", InteractedArticleRoutes());
  app.use("/api/member", MemberRoutes());
  app.use("/api/system", SystemRoutes());
  app.use("/api/reservation", ReservationRoutes());
  app.use("/api/ecosystem", EcosystemRoutes());
  app.use("/api/viewWebsite", ViewWebsiteRoutes());
  app.use("/api/compound", CompoundRoutes());
  app.use((req, res) => {
    res.status(404).send("undefined");
  });

  return app;
};
