const mongoose = require("mongoose");
const InteractedArticleRepository = require("../../interfaces/InteractedArticleRepository");
const InteractedArticleType = require("../../enums/InteractedArticleEnum");

const InteractedArticleSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  userName: { type: String, required: true, unique: true },
  fullName: { type: String, required: true, unique: true },
  avatar: { type: String},
  type: { type: String, required: true },
  value: { type: String, required: true },
  articleID: { type: Number},
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now },
});

const InteractedArticleModel = mongoose.model("InteractedArticle", InteractedArticleSchema);


class MongoInteractedArticleRepository extends InteractedArticleRepository {
  async create(data) {
    const newInteractedArticle = new InteractedArticleModel(data);
    return await newInteractedArticle.save();
  }

  async update(id, updateData) {
    return await InteractedArticleModel.findOneAndUpdate(
      { id: id },
      { ...updateData, updatedDate: Date.now() },
    );
  }

  async delete(id) {
    return await InteractedArticleModel.findOneAndDelete({ id });
  }

  async findById(id) {
    return await InteractedArticleModel.findOne({ id });
  }

  async getLastRateByPerson(username) {
    return await InteractedArticleModel.findOne({ userName: username, type: InteractedArticleType.RATE});
  }

  async getLastId() {
    const lastInteractedArticle = await InteractedArticleModel.findOne()
      .sort({ id: -1 })
      .select("id");
    return lastInteractedArticle ? lastInteractedArticle.id : 0;
  }

  async getAllInteractedArticleByArticleID(article_id) {
    return await InteractedArticleModel.find({ articleID: article_id });
  }

  async getAllInteractedArticles() {
    return await InteractedArticleModel.find({});
  }
}

module.exports = MongoInteractedArticleRepository;
