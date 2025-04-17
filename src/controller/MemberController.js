const {
  CreateMemberUsecase,
  UpdateMemberUsecase,
  DeleteMemberUsecase,
  GetMemberUsecase,
} = require("../usecases");

const sendResponse = require("../utils/Response");
const sendError = require("../utils/HandleError");
const AppError = require("../utils/AppError");

class MemberController {
  constructor(memberRepository, memberDetailRepository) {
    this.createMemberUsecase = new CreateMemberUsecase(
      memberRepository,
      memberDetailRepository
    );
    this.updateMemberUsecase = new UpdateMemberUsecase(
      memberRepository,
      memberDetailRepository
    );
    this.deleteMemberUseCase = new DeleteMemberUsecase(
      memberRepository,
      memberDetailRepository
    );
    this.getMemberUseCase = new GetMemberUsecase(
      memberRepository,
      memberDetailRepository
    );
  }

  // create
  async createMember(req, res) {
    try {
      const memberData = req.body;

      if (!memberData.fullName || !memberData.role || !memberData.department) {
        throw new AppError(
          "All fields (name, role, department) are required.",
          400
        );
      }

      await this.createMemberUsecase.executed(memberData);

      sendResponse(res, 201, "create success", "success", null);
    } catch (error) {
      sendError(res, error);
    }
  }

  async translateMember(req, res) {
    try {
      const { id, fromLangue, toLanguage } = req.params;

      const rs = await this.createMemberUsecase.translateMember(id, fromLangue, toLanguage);

      sendResponse(res, 200, "translate success", "success", rs);
    } catch (error) {
      sendError(res, error);
    }
  }

  // update
  async updateMember(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      if (!id) {
        throw new AppError("Id is required.", 400);
      }
      if (!updateData) {
        throw new AppError("Nothing to update", 400);
      }

      await this.updateMemberUsecase.executed(id, updateData);

      sendResponse(res, 200, "Update member success", null);
    } catch (error) {
      console.log(error);
      sendError(res, error);
    }
  }

  // delete
  async deleteMember(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        throw new AppError("Id is required.", 400);
      }
      await this.deleteMemberUseCase.executed(id);
      sendResponse(res, 200, "Delete member success", "success", null);
    } catch (error) {
      sendError(res, error);
    }
  }

  // get
  async getMemberDetail(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        throw new AppError("Id is required.", 400);
      }
      const member = await this.getMemberUseCase.getMemberById(id);

      const responseData = {
        id: member.id,
        fullName: member.fullName,
        penName: member.penName,
        typeMember: member.typeMember,
        imgUrl: member.imgUrl,
        phone: member.phone,
        gmail: member.gmail,
        description: member.description,
        department: member.department,
        role: member.role,
        memberDetails: member.memberDetails,
        isShow: member.isShow,
        language: member.language,
        createDate: member.createDate,
        coppied_id : member.coppied_id,
      };

      sendResponse(res, 200, "Get detail success", "success", responseData);
    } catch (error) {
      sendError(res, error);
    }
  }

  // search
  async dynamicSearch(req, res) {
    try {
      const { page = 1, limit = 20, ...query } = req.query;
      const members = await this.getMemberUseCase.searchMember(
        page,
        limit,
        query
      );
      sendResponse(res, 200, "Find success", "success", members);
    } catch (error) {
      console.error("Fail", error);
      this.handleError(res, error);
    }
  }

  // get
  async getAllMemberStatisticByYear(req, res) {
    try {
      const { year } = req.params;
      const statistic = await this.getMemberUseCase.getAllMemberStatisticByYear(
        year
      );
      const responseData = statistic;

      sendResponse(res, 200, "Get statistic success", "success", responseData);
    } catch (error) {
      sendError(res, error);
    }
  }
}

module.exports = MemberController;
