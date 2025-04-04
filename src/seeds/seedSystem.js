const MongoSystemRepository = require("../repositories/mongo/MongoSystemRepository");
const { CreateSystemUsecase } = require("../usecases");

const seedSystem = async () => {
  const systemRepository = new MongoSystemRepository();
  const createSystem = new CreateSystemUsecase(systemRepository);

  const systemData = {
    name: "ILC",
    address: "123 ABC",
    phone: "123456789",
    gmail: "a@gmail.com",
    logo_url: "test_url",
  };

  try {
    await createSystem.executed(systemData);
    console.log("create system success");
  } catch (error) {}
};

module.exports = seedSystem;
