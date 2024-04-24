const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();
const sequilize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    dialect: "mysql",
    operatorsAliases: true,
  }
);

sequilize
  .authenticate()
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log("Error in connecting database => ", err);
  });

(async () => {
  try {
    await sequilize.sync({ force: false });
    console.log("Database synchronized");
  } catch (error) {
    console.error("Error synchronizing database:", error);
  }
})();
module.exports = sequilize;
