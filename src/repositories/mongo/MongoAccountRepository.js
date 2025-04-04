const mongoose = require("mongoose");
const AccountRepository = require("../../interfaces/AccountRepository");

const AccountSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  userName: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
  role: { type: String, required: true },
  status: { type: String, default: "active" },
  accessToken: { type: String },
  createDate: { type: Date, default: Date.now },
  updateDate: { type: Date, default: Date.now },
});

const AccountModel = mongoose.model("Account", AccountSchema);

class MongoAccountRepository extends AccountRepository {
  async create(data) {
    const newAccount = new AccountModel(data);
    return await newAccount.save();
  }

  async findByUserName(userName) {
    return await AccountModel.findOne({ userName });
  }

  async updateAccessToken(userName, accessToken) {
    return await AccountModel.findOneAndUpdate(
      { userName },
      { $set: { accessToken } },
      { new: true }
    );
  }

  async update(id, updateData) {
    return await AccountModel.findOneAndUpdate(
      { id },
      { ...updateData, updateDate: Date.now() },
      { new: true }
    );
  }

  async delete(id) {
    return await AccountModel.findOneAndDelete({ id });
  }

  async getInfo(accessToken) {
    return await AccountModel.findOne({ accessToken });
  }

  async findById(id) {
    return await AccountModel.findOne({ id });
  }

  async findAccountByAccesstoken(accessToken) {
    return await AccountModel.findOne({ accessToken });
  }

  async dynamicSearch(skip = 0, limit = 20, query) {
    const filter = {};

    if (query.search) {
      filter.$or = [
        { name: { $regex: new RegExp(query.search, "i") } },
        { userName: { $regex: new RegExp(query.search, "i") } },
      ];
    }

    if (query.role) {
      filter.role = query.role;
    }

    const results = await AccountModel.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createDate: -1 });

    return results;
  }

  async getTotalByDynamicQuery(query) {
    const filter = {};

    if (query.search) {
      filter.$or = [
        { name: { $regex: new RegExp(query.search, "i") } },
        { userName: { $regex: new RegExp(query.search, "i") } },
      ];
    }

    if (query.role) {
      filter.role = query.role;
    }

    return await AccountModel.countDocuments(filter);
  }
}

module.exports = MongoAccountRepository;
