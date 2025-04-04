const mongoose = require("mongoose");
const MemberRepository = require("../../interfaces/AccountRepository");
const {
  RolePriority,
  penNamePriority,
} = require("../../enums/HumanResourceEnum");

const MemberSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  fullName: { type: String, required: true },
  penName: { type: String },
  typeMember: { type: String },
  imgUrl: { type: String },
  phone: { type: String },
  gmail: { type: String },
  description: { type: String },
  department: { type: String, required: true },
  role: { type: String, required: true },
  isShow: { type: Boolean, default: true },
  language: { type: String, default: "VI" },
  createDate: { type: Date, default: Date.now },
  updateDate: { type: Date, default: Date.now },
});

const MemberModel = mongoose.model("Member", MemberSchema);

class MongoMemberRepository extends MemberRepository {
  async create(data) {
    const newMember = new MemberModel(data);
    return await newMember.save();
  }

  async update(id, updateData) {
    return await MemberModel.findOneAndUpdate(
      { id },
      { ...updateData, updateDate: Date.now() },
      { new: true }
    );
  }

  async delete(id) {
    return await MemberModel.findOneAndDelete({ id });
  }

  async findById(id) {
    return await MemberModel.findOne({ id });
  }

  async getLastId() {
    const lastMember = await MemberModel.findOne()
      .sort({ id: -1 })
      .select("id");
    return lastMember ? lastMember.id : 0;
  }

  async dynamicSearch(skip = 0, limit = 20, query) {
    const filter = {};

    if (query.search) {
      filter.$or = [{ fullName: { $regex: new RegExp(query.search, "i") } }];
    }

    if (query.role) {
      filter.role = query.role;
    }

    if (query.isShow) {
      filter.isShow = query.isShow;
    }

    if (query.language) {
      filter.language = query.language;
    }

    const results = await MemberModel.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createDate: -1 });

    return results.sort((a, b) => {
      //role
      const rolePriorityA = RolePriority[a.role] || 9999;
      const rolePriorityB = RolePriority[b.role] || 9999;

      if (rolePriorityA !== rolePriorityB) return rolePriorityA - rolePriorityB;

      //penName
      const penPriorityA = penNamePriority[a.penName] || 9999;
      const penPriorityB = penNamePriority[b.penName] || 9999;

      return penPriorityA - penPriorityB;
    });
  }

  async getTotalByDynamicQuery(query) {
    const filter = {};

    if (query.search) {
      filter.$or = [{ fullName: { $regex: new RegExp(query.search, "i") } }];
    }

    if (query.role) {
      filter.role = query.role;
    }

    if (query.isShow) {
      filter.isShow = query.isShow;
    }

    if (query.language) {
      filter.language = query.language;
    }

    return await MemberModel.countDocuments(filter);
  }

  async getAllMembers() {
    return await MemberModel.find({});
  }
}

module.exports = MongoMemberRepository;
