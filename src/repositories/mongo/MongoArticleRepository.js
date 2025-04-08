const mongoose = require("mongoose");
const ArticleRepository = require("../../interfaces/ArticleRepository");

const ArticleSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  preview_img: { type: String },
  type: { type: String, required: true },
  language: { type: String, required: true },
  summary: { type: String, required: true },
  content: { type: String, required: true },
  views: { type: Number, defaull: 0 },
  createDate: { type: Date, default: Date.now },
  updateDate: { type: Date, default: Date.now },
});

const ArticleModel = mongoose.model("Article", ArticleSchema);

class MongoArticleRepository extends ArticleRepository {
  async create(data) {
    const newArticle = new ArticleModel(data);
    return await newArticle.save();
  }

  async update(id, updateData) {
    return await ArticleModel.findOneAndUpdate(
      { id },
      { ...updateData, updateDate: Date.now() },
      { new: true }
    );
  }

  async delete(id) {
    return await ArticleModel.findOneAndDelete({ id });
  }

  async findById(id) {
    return await ArticleModel.findOne({ id });
  }

  async getLastId() {
    const lastArticle = await ArticleModel.findOne()
      .sort({ id: -1 })
      .select("id");
    return lastArticle ? lastArticle.id : 0;
  }

  async findByTitle(title) {
    return await ArticleModel.findOne({ title });
  }

  async addView(id) {
    return await ArticleModel.findOneAndUpdate(
      { id },
      { $inc: { views: 1 } },
      { new: true }
    );
  }

  async dynamicSearch(skip = 0, limit = 20, query) {
    const filter = {};

    if (query.search) {
      filter.$or = [{ title: { $regex: new RegExp(query.search, "i") } }];
    }

    if (query.type) {
      filter.type = query.type;
    }

    if (query.language) {
      filter.language = query.language;
    }

    const results = await ArticleModel.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createDate: -1 });

    return results;
  }

  async getTotalByDynamicQuery(query) {
    const filter = {};

    if (query.search) {
      filter.$or = [{ title: { $regex: new RegExp(query.search, "i") } }];
    }

    if (query.type) {
      filter.type = query.type;
    }

    if (query.language) {
      filter.language = query.language;
    }

    return await ArticleModel.countDocuments(filter);
  }

  async getAllArticles() {
    return await ArticleModel.find({});
  }
}

module.exports = MongoArticleRepository;
