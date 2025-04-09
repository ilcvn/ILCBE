const MongoSystemRepository = require("../repositories/mongo/MongoSystemRepository");
const { CreateSystemUsecase } = require("../usecases");

const seedSystem = async () => {
  const systemRepository = new MongoSystemRepository();
  const createSystem = new CreateSystemUsecase(systemRepository);

  const systems = [
    {
      name: "ILC",
      address: "123 ABC",
      phone: "123456789",
      gmail: "a@gmail.com",
      logo_url: "test_url",
    },
  ];

  for (const systemData of systems) {
    try {
      await createSystem.executed(systemData);
    } catch (error) {
      console.log(error);
    }
  }
};

module.exports = seedSystem;
