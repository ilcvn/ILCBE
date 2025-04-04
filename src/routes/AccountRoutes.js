const express = require("express");

const AccountController = require("../controller/AccountController");
const MongoAccountRepository = require("../repositories/mongo/MongoAccountRepository");
const {
  sysAdminOnly,
  authMiddleware,
} = require("../middlewares/AuthMiddleware");

const AccountRoutes = () => {
  const router = express.Router();
  const accountRepository = new MongoAccountRepository();

  const accountController = new AccountController(accountRepository);

  // register routes
  router.post("/gadmin/", authMiddleware, sysAdminOnly, (req, res) => {
    req.body.role = "GLOBAL_ADMIN";
    accountController.createAccount(req, res);
  });

  router.post("/it/", authMiddleware, sysAdminOnly, (req, res) => {
    req.body.role = "IT_TECHNICIAN";
    accountController.createAccount(req, res);
  });

  router.post("/admin/", authMiddleware, sysAdminOnly, (req, res) => {
    req.body.role = "ADMIN";
    accountController.createAccount(req, res);
  });

  // login
  router.post("/login", (req, res) => accountController.login(req, res));

  //delete
  router.delete("/:id", authMiddleware, sysAdminOnly, (req, res) =>
    accountController.delete(req, res)
  );

  //update
  router.put("/:id", authMiddleware, sysAdminOnly, (req, res) =>
    accountController.update(req, res)
  );

  //get
  router.get("/i", authMiddleware, (req, res) =>
    accountController.getSelfInfo(req, res)
  );

  router.get("/", authMiddleware, (req, res) =>
    accountController.dynamicSearch(req, res)
  );
  return router;
};

module.exports = AccountRoutes;
