const AppError = require("../../utils/AppError");

class UpdateMember {
  constructor(memberRepository, memberDetailRepository) {
    this.memberRepository = memberRepository;
    this.memberDetailRepository = memberDetailRepository;
  }

  async executed(id, updateData) {
    const existingMember = await this.memberRepository.findById(id);

    if (!existingMember) {
      throw new AppError("Member does not exist", 404);
    }

    delete updateData.id;

    const updatedMember = await this.memberRepository.update(id, updateData);

    await this.memberDetailRepository.deleteByMemberID(id);

    if (updateData.memberDetails && updateData.memberDetails.length > 0) {
      for (let i = 0; i < updateData.memberDetails.length; i++) {
        const lastID = await this.memberDetailRepository.getLastId();
        const newId = lastID + 1;

        const detailMember = {
          ...updateData.memberDetails[i],
          memberID: updatedMember.id,
          id: newId,
        };
        await this.memberDetailRepository.create(detailMember);
      }
    }

    return updatedMember;
  }
}

module.exports = UpdateMember;
