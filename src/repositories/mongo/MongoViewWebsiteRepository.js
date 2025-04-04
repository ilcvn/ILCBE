const mongoose = require("mongoose");
const ViewWebsiteRepository = require("../../interfaces/ViewWebsiteRepository");

const ViewWebsiteSchema = new mongoose.Schema({
  view: { type: Number, default: 0 },
  createDate: { type: Date, default: Date.now, required: true },
  updateDate: { type: Date, default: Date.now }
});

const ViewWebsiteModel = mongoose.model("Viewwebsite", ViewWebsiteSchema);

class MongoViewWebsiteRepository extends ViewWebsiteRepository {
  async create(data) {
    const newViewWebsite = new ViewWebsiteModel(data);
    return await newViewWebsite.save();
  }

  async update(today) {
    return await ViewWebsiteModel.findOneAndUpdate(
    { createDate: today },
    { updateDate: Date.now(), $inc: { view: 1 }},
    { new: true}
  );
  }

  async getViewWebsiteInfoByDate(today) {
    return await ViewWebsiteModel.findOne({ createDate: today });

  }
  
  async getAllViewWebsites() {
    return await ViewWebsiteModel.find({});
  }
}

module.exports = MongoViewWebsiteRepository;
