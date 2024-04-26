const express = require("express");
const app = express();
const routes = require("./api/routes/WeatherRoutes");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(routes);
const flash = require("flash");
app.use(flash);
app.use(cors);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use("/public", express.static(__dirname + "/public"));
console.log(process.env.DB_PASSWORD, process.env.DB_USER);
app.listen(3001 || 3001, () => {
  console.log(`server is runnning on port ${process.env.PORT}`);
});
