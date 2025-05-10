import React, { useEffect, useRef, useState } from "react";
import "./Weather.css";
import SearchIcon from "../assets/search.png";
import ClearIcon from "../assets/clear.png";
import CloudIcon from "../assets/cloud.png";
import DrizzleIcon from "../assets/drizzle.png";
import RainIcon from "../assets/rain.png";
import SnowIcon from "../assets/snow.png";
import WindIcon from "../assets/wind.png";
import HumidityIcon from "../assets/humidity.png";

const Weather = () => {
  const [city, setCity] = useState("");
  const [WeatherData, setWeatherData] = useState(null);

  const [currentVideo, setCurrentVideo] = useState("clear.mp4");
  const [fade, setFade] = useState(false);

  const allIcons = {
    "01d": ClearIcon,
    "01n": ClearIcon,
    "02d": CloudIcon,
    "02n": CloudIcon,
    "03d": CloudIcon,
    "03n": CloudIcon,
    "04d": DrizzleIcon,
    "04n": DrizzleIcon,
    "09d": RainIcon,
    "09n": RainIcon,
    "10d": RainIcon,
    "10n": RainIcon,
    "13d": SnowIcon,
    "13n": SnowIcon,
  };

  const backgroundVideos = {
    "01d": "clear.mp4",
    "01n": "clear.mp4",
    "02d": "cloud.mp4",
    "02n": "cloud.mp4",
    "03d": "cloud.mp4",
    "03n": "cloud.mp4",
    "04d": "drizzle.mp4",
    "04n": "drizzle.mp4",
    "09d": "rain.mp4",
    "09n": "rain.mp4",
    "10d": "rain.mp4",
    "10n": "rain.mp4",
    "13d": "snow.mp4",
    "13n": "snow.mp4",
  };

  const search = async (city) => {
    if (!city.trim()) {
      alert("Please enter a city name.");
      return;
    }

    try {
      const apiKey = import.meta.env.VITE_APP_ID;
      if (!apiKey) {
        console.error("API Key is missing! Check your .env file.");
        return;
      }

      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!data.weather || data.weather.length === 0) {
        alert("Invalid weather data received.");
        return;
      }

      const iconCode = data.weather[0]?.icon;
      const newVideo = backgroundVideos[iconCode] || "clear.mp4";
      console.log("New video:", newVideo);

      if (newVideo !== currentVideo) {
        setFade(true);
        setTimeout(() => {
          setCurrentVideo(newVideo);
          setFade(false);
        }, 500);
      }
      setWeatherData({
        icon: allIcons[iconCode] || ClearIcon,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
      });
    } catch (error) {
      alert("Network error! Please check your internet connection.");
      console.error("Network error:", error);
      setWeatherData(null);
    }
  };

  useEffect(() => {
    search("Puducherry");
  }, []);

  return (
    <div className="body">
      {WeatherData && (
        <video
          key={currentVideo}
          autoPlay
          muted
          loop
          playsInline
          className={`background-video ${fade ? "fade" : ""}`}
        >
          <source
            src={`${import.meta.env.BASE_URL}videos/${currentVideo}`}
            type="video/mp4"
          />
        </video>
      )}

      <div className="main-container">
        <div id="title">
          <h1>Weather API</h1>
          <p>Real-time updates on current weather conditions.</p>
        </div>

        <div className="Weather">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  search(city);
                }
              }}
            />
            <img
              src={SearchIcon}
              alt="Search"
              onClick={() => search(city)}
              style={{ cursor: "pointer" }}
            />
          </div>

          {WeatherData ? (
            <>
              <img
                src={WeatherData.icon}
                alt="Weather Icon"
                className="WeatherIcon"
              />
              <p className="Temperature">{WeatherData.temperature}°C</p>
              <p className="Location">{WeatherData.location}</p>
              <div className="WeatherData">
                <div className="Col">
                  <img src={HumidityIcon} alt="Humidity" />
                  <div>
                    <p>{WeatherData.humidity}%</p>
                    <span>Humidity</span>
                  </div>
                </div>

                <div className="Col">
                  <img src={WindIcon} alt="Wind Speed" />
                  <div>
                    <p>{WeatherData.windSpeed} km/h</p>
                    <span>Wind Speed</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p>Loading weather data...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Weather;
