const Translator = require("../../utils/Translator");

class CreateMember {
  constructor(memberRepository, memberDetailRepository) {
    this.memberRepository = memberRepository;
    this.memberDetailRepository = memberDetailRepository;
  }

  async executed(data) {
    const lastID = await this.memberRepository.getLastId();
    const newId = lastID + 1;

    const member = {
      ...data,
      id: newId,
    };

    const createdMember = await this.memberRepository.create(member);

    return createdMember;
  }
  
  async translateMember(id, fromLangue, toLanguage) {
    const member = await this.memberRepository.findById(id);
    if (!member) {
      throw new AppError("Member does not exist", 404);
    }

    const lastID = await this.memberRepository.getLastId();
    const newId = lastID + 1;

    const translateFromLanguage =
    fromLangue !== "ZH"
        ? fromLangue.toLowerCase()
        : fromLangue.toLowerCase() + "-CN";
    
    const translateToLanguage =
    toLanguage !== "ZH"
        ? toLanguage.toLowerCase()
        : toLanguage.toLowerCase() + "-CN";

    const newMember = {
      id: newId,
      fullName: member.fullName,
      penName: (await Translator.translateText(member.penName, translateFromLanguage, translateToLanguage)).toUpperCase(),
      typeMember: member.typeMember,
      imgUrl: member.imgUrl,
      phone: member.phone,
      gmail: member.gmail,
      description: await Translator.translateText(
        member.description,
        translateFromLanguage,
        translateToLanguage
      ),
      department: member.department,
      role: member.role,
      isShow: member.isShow,
      language: toLanguage,
      createDate: Date.now(),
      updateDate: Date.now(),
      coppied_id : member.coppied_id === 0 ? member.id: member.coppied_id,
    };

    console.log(newMember);

    const createdMember = await this.memberRepository.create(newMember);

    newMember.memberDetails =
      await this.memberDetailRepository.getAllMemberDetailsByMemberID(
        member.id
      );

    const lastDetailID = await this.memberDetailRepository.getLastId();

    for (let i = 0; i < newMember.memberDetails.length; i++) {
      const newDetailId = lastDetailID + i + 1;
      const newDetailMember = {
        id: newDetailId,
        memberID: newId,
        title: await Translator.translateText(
          newMember.memberDetails[i].title,
          translateFromLanguage,
          translateToLanguage
        ),
        place: await Translator.translateText(
          newMember.memberDetails[i].place,
          translateFromLanguage,
          translateToLanguage
        ),
        fromDate: newMember.memberDetails[i].fromDate,
        toDate: newMember.memberDetails[i].toDate,
        description: await Translator.translateText(
          newMember.memberDetails[i].description,
          translateFromLanguage,
          translateToLanguage
        ),
        typeDetail: newMember.memberDetails[i].typeDetail,
        createDate: Date.now(),
        updateDate: Date.now(),
      };

      const createdDetailMember = await this.memberDetailRepository.create(
        newDetailMember
      );
    }

    return createdMember;
  }
}

module.exports = CreateMember;
