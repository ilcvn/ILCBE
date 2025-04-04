class CreateMember {
  constructor(memberRepository, memberDetailRepository) {
    this.memberRepository = memberRepository;
    this.memberDetailRepository = memberDetailRepository;
  }

  async executed(data) {
    const lastID = await this.memberRepository.getLastId();
    const newId = lastID + 1;

    // const memberDetails = data.memberDetails;
    // delete data.memberDetails;

    const member = {
      ...data,
      id: newId,
    };

    const createdMember = await this.memberRepository.create(member);

    // const newDetailId = await this.memberDetailRepository.getLastId();
    // for (let i = 0; i < memberDetails.length; i++) {
    //   const detailMember = {
    //     ...memberDetails[i],
    //     memberID: newId,
    //     id: newDetailId + i + 1,
    //   };
    //   await this.memberDetailRepository.create(detailMember);
    // }

    return createdMember;
  }
}

module.exports = CreateMember;
