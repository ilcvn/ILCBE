const mongoose = require("mongoose");
const SystemRepository = require("../../interfaces/SystemRepository");

const SystemSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true, default: 1 },
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String },
  gmail: { type: String },
  logo_url: { type: String, required: false },
  createDate: { type: Date, default: Date.now },
  updateDate: { type: Date, default: Date.now },
});

const SystemModel = mongoose.model("System", SystemSchema);

class MongoSystemRepository extends SystemRepository {
  async create(data) {
    const newSystem = new SystemModel(data);
    return await newSystem.save();
  }

  async update(updateData) {
    return await SystemModel.findOneAndUpdate(
      { id: 1 },
      { ...updateData, updateDate: Date.now() },
      { new: true }
    );
  }

  async getSystemInfo() {
    return await SystemModel.findOne({ id: 1 });
  }
}

module.exports = MongoSystemRepository;
