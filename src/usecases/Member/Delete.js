const AppError = require("../../utils/AppError");

class DeleteMember {
  constructor(memberRepository, memberDetailRepository) {
    this.memberRepository = memberRepository;
    this.memberDetailRepository = memberDetailRepository;
  }

  async executed(id) {
    const existingMember = await this.memberRepository.findById(id);

    if (!existingMember) {
      throw new AppError("Member does not exist", 404);
    }

    let result = await this.memberRepository.delete(id);
    result = await this.memberDetailRepository.deleteByMemberID(id);
    return result;
  }
}

module.exports = DeleteMember;
