const config = require("./src/configs/config");
const connectDB = require("./src/configs/database");
const expressApp = require("./src/frameworks/Express");
const errorHandler = require("./src/utils/AppError");

const seedAccount = require("./src/seeds/seedAccount");
const seedSystem = require("./src/seeds/seedSystem");

const startServer = async () => {
  await connectDB();
  const app = expressApp();
  app.use(errorHandler);

  // await seedAccount();
  await seedSystem();

  const PORT = config.PORT;
  app.listen(PORT, () => console.log(`Service running on port ${PORT}`));
};

startServer();
