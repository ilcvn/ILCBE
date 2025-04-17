const AppError = require("../../utils/AppError");
const { paginate } = require("../../utils/Pagination");
const DateTimeHandle = require("../../utils/DatetimeHandle");
const ArticleEnum = require("../../enums/ArticleEnum");

class GetArticle {
  constructor(articleRepository, interactedArticleRepository) {
    this.articleRepository = articleRepository;
    this.interactedArticleRepository = interactedArticleRepository;
  }

  async getArticleById(id) {
    const article = await this.articleRepository.findById(id);
    if (!article) {
      throw new AppError("article does not exist", 404);
    }
    const updatedArticle = await this.articleRepository.addView(id);

    updatedArticle.interactedArticles =
      await this.interactedArticleRepository.getAllInteractedArticleByArticleID(
        updatedArticle.id
      );

    return updatedArticle;
  }

  async searchArticle(page = 1, limit = 20, query) {
    const { skip, limit: paginatedLimit } = paginate({}, page, limit);

    const articles = await this.articleRepository.dynamicSearch(
      skip,
      paginatedLimit,
      query
    );

    const total = await this.articleRepository.getTotalByDynamicQuery(query);

    const interactedArticleList =
      await this.interactedArticleRepository.getAllInteractedArticles();

    const articleList = await this.listArticles(articles);

    for (let i = 0; i < articleList.length; i++) {
      const filteredList = interactedArticleList.filter((item) => {
        return item.articleID == articleList[i].id;
      });

      articleList[i].interactedArticles = filteredList;
    }

    return {
      articles: articleList,
      pagination: {
        page: parseInt(page),
        limit: paginatedLimit,
        total,
      },
    };
  }

  async listArticles(articles) {
    return articles.map((article) => {
      const articleObject = article.toObject();
      delete articleObject._id;
      delete articleObject.content;
      delete articleObject.__v;
      return {
        ...articleObject,
      };
    });
  }

  async getAllArticleStatisticByYear(year) {
    const allMonths = [];
    const articles = await this.articleRepository.getAllArticles();

    for (let month = 0; month < 12; month++) {
      const firstDateOfMonth = DateTimeHandle.getDateByOption(year, month, 1);
      const firstDateOfNextMonth = DateTimeHandle.getDateByOption(
        year,
        month + 1,
        1
      );

      const newsList = articles.filter((item) => {
        const itemDate = item.createDate;
        return (
          item.type == ArticleEnum.NEWS &&
          itemDate >= firstDateOfMonth &&
          itemDate < firstDateOfNextMonth
        );
      });

      const knowledgeList = articles.filter((item) => {
        const itemDate = item.createDate;
        return (
          item.type == ArticleEnum.KNOWLEDGE &&
          itemDate >= firstDateOfMonth &&
          itemDate < firstDateOfNextMonth
        );
      });

      const serviceList = articles.filter((item) => {
        const itemDate = item.createDate;
        return (
          item.type == ArticleEnum.SERVICE &&
          itemDate >= firstDateOfMonth &&
          itemDate < firstDateOfNextMonth
        );
      });

      allMonths.push({
        dateName: "T" + (month + 1),
        quantityNews: newsList.length,
        quantityKnowledge: knowledgeList.length,
        quantityService: serviceList.length,
      });
    }
    return allMonths;
  }

  async getAllCountImageUrl(preview_img) {
    return this.articleRepository.getCountImageUrl(preview_img);
  }
}

module.exports = GetArticle;
