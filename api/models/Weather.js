const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("./dbConfig.js");

const Weather = sequelize.define("weather", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  location: {
    type: DataTypes.JSON,
  },
  current: {
    type: DataTypes.JSON,
  },
  forecast: {
    type: DataTypes.JSON,
  },
});

module.exports = Weather;
