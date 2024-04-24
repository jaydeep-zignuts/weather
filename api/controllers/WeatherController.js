const { where } = require("sequelize");
const WeatherData = require("../models/Weather");
const Axios = require("axios");
const addWeather = async (req, res) => {
  try {
    let city = req.query.city;
    if (!city) {
      city = "Delhi";
    }
    console.log(city);
    const requestedData = await WeatherData.findOne({
      where: { location: { name: city.toLowerCase() } },
    });
    if (requestedData == null) {
      console.log("hello if");
      let data = await Axios.get(
        `http://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_KEY}&q=${city}`
      );
      data.data.location.name = await data.data.location.name.toLowerCase();
      console.log(data.data.forecast.forecastday[0].hour[4].time);
      for (
        let i = 0;
        i < data.data.forecast.forecastday[0].hour.length;
        i = i + 3
      ) {
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
      console.log("hello else");
      // return res.json({ res: requestedData });

      return res.render("wet", { res: requestedData });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  addWeather,
};
