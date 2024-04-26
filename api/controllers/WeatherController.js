const WeatherData = require("../models/Weather");
const flash = require("flash");
const cron = require("node-cron");
const Axios = require("axios");

const addWeather = async (req, res) => {
  try {
    let city = req.query.city;
    if (!city) {
      city = "Ahmedabad";
    }
    console.log(city);
    const requestedData = await WeatherData.findOne({
      where: { location: { name: city.toLowerCase() } },
    });
    console.log("requestedData,", requestedData);
    if (requestedData == null) {
      console.log("hello if", city);
      let data = await Axios.get(
        `http://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_KEY}&q=${city}`
      );
      console.log("data, data", data);

      data.data.location.name = await data.data.location.name.toLowerCase();
      for (let i = 0; i < data.data.forecast.forecastday[0].hour.length; i++) {
        data.data.forecast.forecastday[0].hour[i].time = new Date(
          data.data.forecast.forecastday[0].hour[i].time
        ).getHours();
      }
      const newCityData = await WeatherData.create({
        location: data.data.location,
        current: data.data.current,
        forecast: data.data.forecast,
      });
      await newCityData.save();
      // return res.status(200).json({ data: data.data });
      return res.render("wet", { res: data.data });
    } else {
      return res.render("wet", { res: requestedData });
    }
  } catch (err) {
    const requestedData = await WeatherData.findOne({
      where: { location: { name: "Ahmedabad" } },
    });

    return res.render("wet", { res: requestedData, error: err });
  }
};

const task = async () => {
  console.log("Running cron job at:", new Date());
  try {
    await WeatherData.truncate();
    console.log("insid is");
    let city = "Ahmedabad";

    console.log(city);
    const requestedData = await WeatherData.findOne({
      where: { location: { name: city.toLowerCase() } },
    });
    if (requestedData == null) {
      console.log("hello if");
      let data = await Axios.get(
        `http://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_KEY}&q=${city}`
      );
      console.log(data);

      data.data.location.name = await data.data.location.name.toLowerCase();
      for (let i = 0; i < data.data.forecast.forecastday[0].hour.length; i++) {
        data.data.forecast.forecastday[0].hour[i].time = new Date(
          data.data.forecast.forecastday[0].hour[i].time
        ).getHours();
      }
      const newCityData = await WeatherData.create({
        location: data.data.location,
        current: data.data.current,
        forecast: data.data.forecast,
      });
      await newCityData.save();
      // return res.status(200).json({ data: data.data });
      // return res.status(200).json({ res: data.data });
    } else {
      // return res.status(200).json({ res: requestedData });
    }
  } catch (err) {
    console.log(err);
    // return res.status(500).json({ res: err });
  }
};
cron.schedule("0 * * * *", task);

module.exports = {
  addWeather,
};
