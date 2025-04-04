const mongoose = require("mongoose");
const MemberDetailRepository = require("../../interfaces/MemberDetailRepository");
const {
  RolePriority,
  penNamePriority,
} = require("../../enums/HumanResourceEnum");

const MemberDetailSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  memberID: { type: Number },
  typeDetail: { type: String },
  title: { type: String },
  description: { type: String },
  fromDate: { type: String },
  toDate: { type: String },
  place: { type: String, default: "VI" },
  createDate: { type: Date, default: Date.now },
  updateDate: { type: Date, default: Date.now },
});

const MemberDetailModel = mongoose.model("MemberDetail", MemberDetailSchema);

class MongoMemberDetailRepository extends MemberDetailRepository {
  async create(data) {
    const newMemberDetail = new MemberDetailModel(data);
    return await newMemberDetail.save();
  }

  async update(id, updateData) {
    return await MemberDetailModel.findOneAndUpdate(
      { id },
      { ...updateData, updateDate: Date.now() },
      { new: true }
    );
  }

  async delete(id) {
    return await MemberDetailModel.findOneAndDelete({ id });
  }

  async deleteByMemberID(id) {
    return await MemberDetailModel.deleteMany({ memberID: id });
  }

  async findById(id) {
    return await MemberDetailModel.findOne({ id });
  }

  async getLastId() {
    const lastMemberDetail = await MemberDetailModel.findOne()
      .sort({ id: -1 })
      .select("id");
    return lastMemberDetail ? lastMemberDetail.id : 0;
  }

  async dynamicSearch(skip = 0, limit = 20, query) {
    const filter = {};

    if (query.search) {
      filter.$or = [{ fullName: { $regex: new RegExp(query.search, "i") } }];
    }

    const results = await MemberDetailModel.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createDate: -1 });

    return results;
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

    return await MemberDetailModel.countDocuments(filter);
  }

  async getAllMemberDetailsByMemberID(member_id) {
    return await MemberDetailModel.find({ memberID: member_id });
  }

  async getAllMemberDetails() {
    return await MemberDetailModel.find({});
  }
}

module.exports = MongoMemberDetailRepository;
