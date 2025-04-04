const mongoose = require("mongoose");
const EcosystemRepository = require("../../interfaces/EcosystemRepository");

const EcosystemSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  fullName: { type: String, required: true },
  linkWebsite: { type: String, required: true },
  typeEcosystem: { type: String, required: true },
  imgUrl: { type: String },
  isShow: { type: Boolean, default: true },
  createDate: { type: Date, default: Date.now },
  updateDate: { type: Date, default: Date.now },
});

const EcosystemModel = mongoose.model("Ecosystem", EcosystemSchema);

class MongoEcosystemRepository extends EcosystemRepository {
  async create(data) {
    const newEcosystem = new EcosystemModel(data);
    return await newEcosystem.save();
  }

  async update(id, updateData) {
    return await EcosystemModel.findOneAndUpdate(
      { id },
      { ...updateData, updateDate: Date.now() },
      { new: true }
    );
  }

  async delete(id) {
    return await EcosystemModel.findOneAndDelete({ id });
  }

  async findById(id) {
    return await EcosystemModel.findOne({ id });
  }

  async getLastId() {
    const lastEcosystem = await EcosystemModel.findOne()
      .sort({ id: -1 })
      .select("id");
    return lastEcosystem ? lastEcosystem.id : 0;
  }

  async dynamicSearch(skip = 0, limit = 20, query) {
    const filter = {};

    if (query.search) {
      filter.$or = [{ fullName: { $regex: new RegExp(query.search, "i") } }];
    }

    if (query.isShow) {
      filter.isShow = query.isShow;
    }

    const results = await EcosystemModel.find(filter)
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

    if (query.isShow) {
      filter.isShow = query.isShow;
    }

    return await EcosystemModel.countDocuments(filter);
  }
}

module.exports = MongoEcosystemRepository;
