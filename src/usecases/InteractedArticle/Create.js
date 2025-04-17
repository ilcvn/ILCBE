const InteractedArticleType = require("../../enums/InteractedArticleEnum");
class CreateInteractedArticle {
    constructor(InteractedArticleRepository) {
      this.InteractedArticleRepository = InteractedArticleRepository;
    }
  
    async executed(data) {
      console.log('vo day');
      const lastRate = await this.InteractedArticleRepository.getLastRateByPersonInAnArticle(data.userName, data.articleID);
      if(lastRate && data.type === InteractedArticleType.RATE){
        lastRate.value = data.value;
        const updatedInteractedArticle = await this.InteractedArticleRepository.update(
          lastRate.id,
          lastRate
        );
        return updatedInteractedArticle;
      }else{
        const lastID = await this.InteractedArticleRepository.getLastId();
        const newId = lastID + 1;
    
        const InteractedArticle = {
          ...data,
          id: newId,
        };

        InteractedArticle.articleID = Number(InteractedArticle.articleID);
        const createdInteractedArticle = await this.InteractedArticleRepository.create(InteractedArticle);
        return createdInteractedArticle;
      }
    }
  }
  
module.exports = CreateInteractedArticle;
