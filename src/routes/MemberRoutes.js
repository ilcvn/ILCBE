const express = require("express");
const { authMiddleware } = require("../middlewares/AuthMiddleware");
const MongoMemberRepository = require("../repositories/mongo/MongoMemberRepository");
const MongoMemberDetailRepository = require("../repositories/mongo/MongoMemberDetailRepository");
const MemberController = require("../controller/MemberController");

const MemberRoutes = () => {
  const router = express.Router();

  const memberRepository = new MongoMemberRepository();
  const MemberDetailRepository = new MongoMemberDetailRepository();
  const memberController = new MemberController(
    memberRepository,
    MemberDetailRepository
  );

  router.post("/", authMiddleware, (req, res) => {
    memberController.createMember(req, res);
  });
  router.post(
    "/translate/:id/:fromLangue/:toLanguage",
    authMiddleware,
    (req, res) => {
      memberController.translateMember(req, res);
    }
  );

  router.put("/:id", authMiddleware, (req, res) => {
    memberController.updateMember(req, res);
  });

  router.delete("/:id", authMiddleware, (req, res) => {
    memberController.deleteMember(req, res);
  });

  router.get("/:id", (req, res) => {
    memberController.getMemberDetail(req, res);
  });

  router.get("/", (req, res) => memberController.dynamicSearch(req, res));

  router.get("/count/image", (req, res) =>
    memberController.getAllCountImageUrl(req, res)
  );

  router.post("/statistic/:year", authMiddleware, (req, res) =>
    memberController.getAllMemberStatisticByYear(req, res)
  );

  return router;
};

module.exports = MemberRoutes;
