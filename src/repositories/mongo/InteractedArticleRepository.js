const mongoose = require("mongoose");
const InteractedArticleRepository = require("../../interfaces/InteractedArticleRepository");

const InteractedArticleSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userName: { type: String, required: true, unique: true },
  fullName: { type: String, required: true, unique: true },
  avatar: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  value: { type: String, required: true },
  articleID: { type: String, required: true, unique: true },
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now },
});

const InteractedArticleModel = mongoose.model("InteractedArticle", InteractedArticleSchema);

InteractedArticleRepository

class MongoInteractedArticleRepository extends InteractedArticleRepository {
  async create(data) {
    const newInteractedArticle = new InteractedArticleModel(data);
    return await newInteractedArticle.save();
  }

  async delete(id) {
    return await InteractedArticleModel.findOneAndDelete({ id });
  }

  async findById(id) {
    return await InteractedArticleModel.findOne({ id });
  }

  async getAllInteractedArticleByArticleID(article_id) {
    return await MemberDetailModel.find({ articleID: article_id });
  }
}

module.exports = MongoInteractedArticleRepository;
