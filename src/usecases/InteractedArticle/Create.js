class CreateInteractedArticle {
    constructor(InteractedArticleRepository) {
      this.InteractedArticleRepository = InteractedArticleRepository;
    }
  
    async executed(data) {
      const lastRate = await this.InteractedArticleRepository.getLastRateByPerson(data.userName);
      if(lastRate && lastRate.articleID === data.articleID){
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
    
        const createdInteractedArticle = await this.InteractedArticleRepository.create(InteractedArticle);
    
        return createdInteractedArticle;
      }
    }
  }
  
module.exports = CreateInteractedArticle;
