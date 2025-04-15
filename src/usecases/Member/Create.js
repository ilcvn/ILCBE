const translate = require('google-translate-api-x');
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

  async translateText(text, fromLang = 'vi', toLang = 'zh-CN', format = 'plain') {
    try {
      const lines = text.split('\n');
  
      const translatedLines = await Promise.all(
        lines.map(async (line) => {
          if (line.trim() === '') return '';
          const result = await translate(line, { from: fromLang, to: toLang });
          return result.text;
        })
      );
  
      const resultText = translatedLines.join('\n');
  
      if (format === 'html') {
        return resultText.replace(/\n/g, '<br>');
      }
      return resultText;
    } catch (error) {
      console.error('Translation error:', error);
      throw error;
    }
  }

  async translateMember(id, language) {

    const member = await this.memberRepository.findById(id);
    if (!member) {
      throw new AppError("Member does not exist", 404);
    }

    const lastID = await this.memberRepository.getLastId();
    const newId = lastID + 1;

    const toLanguage = language !== 'ZH' ? language.toLowerCase() : (language.toLowerCase()+"-CN");

    const newMember = {
      id: newId,
      fullName: member.fullName,
      penName: await this.translateText(member.penName, 'vi', toLanguage),
      typeMember: member.typeMember,
      imgUrl: member.imgUrl,
      phone: member.phone,
      gmail: member.gmail,
      description: await this.translateText(member.description, 'vi', toLanguage),
      department: member.department,
      role: member.role,
      isShow: member.isShow,
      language: language,
      createDate: Date.now(),
      updateDate: Date.now(),
    };

    const createdMember = await this.memberRepository.create(newMember);

    newMember.memberDetails =
    await this.memberDetailRepository.getAllMemberDetailsByMemberID(
      member.id
    );

    const lastDetailID = await this.memberDetailRepository.getLastId();
    
    for(let i = 0; i < member.memberDetails.length; i++){

      const newDetailId = lastDetailID + i + 1;
      const newDetailMember = {
        id: newDetailId,
        memberID: newId,
        title: await this.translateText(title, 'vi', toLanguage),
        place: await this.translateText(place, 'vi', toLanguage),
        fromDate: newMember.memberDetails[i].fromDate,
        toDate: newMember.memberDetails[i].toDate,
        description: await this.translateText(description, 'vi', toLanguage),
        typeDetail: newMember.memberDetails[i].typeDetail,
        createDate: Date.now(),
        updateDate: Date.now(),
      };

      const createdDetailMember = await this.memberDetailRepository.create(newDetailMember);
    }

    return createdMember;
  }
}

module.exports = CreateMember;
