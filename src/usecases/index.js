// Account
const CreateAccountUsecase = require("./Account/Create");
const LoginUseCase = require("./Account/Login");
const DeleteAccountUseCase = require("./Account/Delete");
const UpdateAccountUseCase = require("./Account/Update");
const GetAccountUseCase = require("./Account/Get");

// Article
const CreateArticleUsecase = require("./Article/Create");
const DeleteArticleUsecase = require("./Article/Delete");
const UpdateArticleUsecase = require("./Article/Update");
const GetArticleUsecase = require("./Article/Get");

// Member
const CreateMemberUsecase = require("./Member/Create");
const DeleteMemberUsecase = require("./Member/Delete");
const UpdateMemberUsecase = require("./Member/Update");
const GetMemberUsecase = require("./Member/Get");

// System
const CreateSystemUsecase = require("./System/Create");
const UpdateSystemUsecase = require("./System/Update");
const GetSystemUsecase = require("./System/Get");

// Reservation
const CreateReservationUsecase = require("./Reservation/Create");
const DeleteReservationUsecase = require("./Reservation/Delete");
const UpdateReservationUsecase = require("./Reservation/Update");
const GetReservationUsecase = require("./Reservation/Get");

// Ecosystem
const CreateEcosystemUsecase = require("./Ecosystem/Create");
const DeleteEcosystemUsecase = require("./Ecosystem/Delete");
const UpdateEcosystemUsecase = require("./Ecosystem/Update");
const GetEcosystemUsecase = require("./Ecosystem/Get");

// ViewWebstie
const UpdateViewWebsiteUsecase = require("./ViewWebsite/Update");
const GetViewWebsiteUsecase = require("./ViewWebsite/Get");

// Compound
const GetCompoundUsecase = require("./Compound/Get");

module.exports = {
  CreateAccountUsecase,
  LoginUseCase,
  DeleteAccountUseCase,
  UpdateAccountUseCase,
  GetAccountUseCase,

  CreateArticleUsecase,
  DeleteArticleUsecase,
  UpdateArticleUsecase,
  GetArticleUsecase,

  CreateMemberUsecase,
  DeleteMemberUsecase,
  UpdateMemberUsecase,
  GetMemberUsecase,

  CreateSystemUsecase,
  UpdateSystemUsecase,
  GetSystemUsecase,

  CreateReservationUsecase,
  DeleteReservationUsecase,
  UpdateReservationUsecase,
  GetReservationUsecase,
 
  CreateEcosystemUsecase,
  DeleteEcosystemUsecase,
  UpdateEcosystemUsecase,
  GetEcosystemUsecase,

  UpdateViewWebsiteUsecase,
  GetViewWebsiteUsecase,

  GetCompoundUsecase,
};
