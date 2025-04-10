const MongoAccountRepository = require("../repositories/mongo/MongoAccountRepository");
const { CreateAccountUsecase } = require("../usecases");

const seedAccount = async () => {
  const accountRepository = new MongoAccountRepository();
  const createSeedAccount = new CreateAccountUsecase(accountRepository);

  const accounts = [
    {
      name: "ILC",
      userName: "GAdmin1",
      password: "123",
      role: "GLOBAL_ADMIN",
    },
  ];

  for (const accountData of accounts) {
    try {
      await createSeedAccount.executed(accountData);
    } catch (error) {
      console.log(error);
    }
  }
};

module.exports = seedAccount;
