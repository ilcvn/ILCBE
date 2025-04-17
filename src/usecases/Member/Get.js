const AppError = require("../../utils/AppError");
const { paginate } = require("../../utils/Pagination");
const DateTimeHandle = require("../../utils/DatetimeHandle");

class GetMember {
  constructor(memberRepository, memberDetailRepository) {
    this.memberRepository = memberRepository;
    this.memberDetailRepository = memberDetailRepository;
  }

  async getMemberById(id) {
    const member = await this.memberRepository.findById(id);
    if (!member) {
      throw new AppError("Member does not exist", 404);
    }

    member.memberDetails =
      await this.memberDetailRepository.getAllMemberDetailsByMemberID(
        member.id
      );

    return member;
  }

  async searchMember(page = 1, limit = 20, query) {
    const { skip, limit: paginatedLimit } = paginate({}, page, limit);
    const members = await this.memberRepository.dynamicSearch(
      skip,
      paginatedLimit,
      query
    );

    const total = await this.memberRepository.getTotalByDynamicQuery(query);

    const MemberDetails =
      await this.memberDetailRepository.getAllMemberDetails();

    const memberList = await this.listMembers(members);

    for (let i = 0; i < memberList.length; i++) {
      const filteredList = MemberDetails.filter((item) => {
        return item.memberID == memberList[i].id;
      });

      memberList[i].memberDetails = filteredList;
    }

    return {
      members: memberList,
      pagination: {
        page: parseInt(page),
        limit: paginatedLimit,
        total,
      },
    };
  }

  async listMembers(members) {
    return members.map((member) => {
      const memberObject = member.toObject();
      delete memberObject._id;
      delete memberObject.__v;
      return {
        ...memberObject,
      };
    });
  }

  async getAllMemberStatisticByYear(year) {
    const allMonths = [];
    const members = await this.memberRepository.getAllMembers();

    for (let month = 0; month < 12; month++) {
      const firstDateOfMonth = DateTimeHandle.getDateByOption(year, month, 1);
      const firstDateOfNextMonth = DateTimeHandle.getDateByOption(
        year,
        month + 1,
        1
      );

      const filteredList = members.filter((item) => {
        const itemDate = item.createDate;
        return itemDate >= firstDateOfMonth && itemDate < firstDateOfNextMonth;
      });
      allMonths.push({
        dateName: "T" + (month + 1),
        quantity: filteredList.length,
      });
    }
    return allMonths;
  }

  async getAllCountImageUrl(imageUrl) {
    return this.memberRepository.getCountImageUrl(imageUrl);
  }
}

module.exports = GetMember;
