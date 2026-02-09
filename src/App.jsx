// Import useState from React library
// useState is a Hook that allows us to store data (state) in a component
import { useState } from "react";

// API key used to authenticate requests to OpenWeather server
// Without this key, the API will not return data
// meta.env is used to read the API key from environment variables
// This prevents hard-coding sensitive data in frontend code
// In Vite, environment variables MUST start with VITE_
const API_KEY = import.meta.env.VITE_API_KEY;

// This is the main React component
// Function name MUST start with capital letter
function App() {

  // city = variable to store city name
  // setCity = function to update city value
  // useState("") means initial value is empty string
  const [city, setCity] = useState("");

  // current = stores current weather data (object)
  // initial value is null (means no data yet)
  const [current, setCurrent] = useState(null);

  // forecast = stores 5-day weather data (array)
  // initial value is empty array
  const [forecast, setForecast] = useState([]);

  // error = stores error message string
  // used when city is invalid or API fails
  const [error, setError] = useState("");

  // Function to fetch weather data when button is clicked
  // async means this function contains await
  const fetchWeather = async () => {

    // try block is used to handle errors safely
    try {

      // Clear previous error message (if any)
      setError("");

      // If city input is empty, stop execution
      if (!city) {
        throw new Error("Please enter a city name");
      }

      // ---------------- CURRENT WEATHER REQUEST ----------------

      // fetch() sends request to the API URL
      // await waits until response comes
      const res1 = await fetch(
        // Template string (``) allows variable insertion using ${}
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      // res1.ok checks if response status is 200 (success)
      // If city is wrong, it becomes false
      if (!res1.ok) {
        throw new Error("City not found"); // manually throw error
      }

      // Convert response data into JavaScript object
      const currentData = await res1.json();

      // Store current weather data in state
      // This will automatically update the UI
      setCurrent(currentData);

      // ---------------- FORECAST REQUEST ----------------

      const res2 = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );

      // Check forecast response
      if (!res2.ok) {
        throw new Error("Forecast not available");
      }

      // Convert forecast response to JavaScript object
      const forecastData = await res2.json();

      // forecastData.list contains data every 3 hours (8 per day)
      // index % 8 === 0 selects ONE item per day
      const daily = forecastData.list.filter(
        (item, index) => index % 8 === 0
      );

      // Store filtered forecast data
      setForecast(daily);

    } catch (err) {

      // If any error happens, clear weather data
      setCurrent(null);
      setForecast([]);

      // Store error message in error state
      setError(err.message);
    }
  };

  // return() defines what appears on the screen
  return (

    // Main container div
    // min-h-screen = full screen height
    // bg-blue-100 = background color
    // p-4 = padding
    <div className="min-h-screen bg-blue-100 p-4">

      {/* HEADER SECTION */}
      <div className="bg-blue-200 rounded-xl p-4 text-center mb-4">

        {/* App Title */}
        <h1 className="text-2xl font-semibold">

          {/* Cloud icon from Font Awesome */}
          {/* className is used instead of class in React */}
          <i className="fa-regular fa-cloud text-blue-500 text-3xl"></i>

          {/* Space between icon and text */}
          {" "}Weather App
        </h1>
      </div>

      {/* SEARCH SECTION */}
      <div className="bg-white p-4 rounded-xl shadow flex gap-2 mb-4">

        {/* Input field */}
        <input
          className="border p-2 flex-1 rounded" // Tailwind styles
          placeholder="Enter city name"          // Hint text
          value={city}                           // value from state
          onChange={(e) =>                       // event handler
            setCity(e.target.value)              // update city state
          }
        />

        {/* Button */}
        <button
          onClick={fetchWeather}                 // call function on click
          className="bg-blue-500 text-white px-4 rounded"
        >
          Search
        </button>
      </div>

      {/* ERROR MESSAGE */}
      {/* Shows only if error is not empty */}
      {error && (
        <p className="text-red-500 text-center">
          {error}
        </p>
      )}

      {/* CURRENT WEATHER SECTION */}
      {/* Render only if current data exists */}
      {current && (

        <div
          className="rounded-2xl p-6 text-white mb-4"
          style={{
            // Inline CSS for background image
            backgroundImage:
              "url('https://www.weathercompany.com/wp-content/uploads/2024/01/AdobeStock_359999296-sized.jpg')",
            backgroundSize: "cover",
          }}
        >

          {/* City Name */}
          <h2 className="text-xl font-semibold">
            Weather in{" "}
            <span className="text-red-400">
              {current.name}
            </span>
          </h2>

          {/* Local Time */}
          <p className="text-sm mb-2">
            Local Time: {new Date().toLocaleTimeString()}
          </p>

          {/* Temperature Display */}
          <div className="text-center my-4">

            {/* Temperature value */}
            <p className="text-5xl font-bold text-purple-500">
              {current.main.temp}°C
            </p>

            {/* Weather description */}
            <p className="capitalize">
              {current.weather[0].description}
            </p>
          </div>

          {/* Extra Details */}
          <div className="grid grid-cols-2 gap-2 text-sm">

            <p>Feels like: {current.main.feels_like}°C</p>
            <p>Humidity: {current.main.humidity}%</p>
            <p>Wind: {current.wind.speed} m/s</p>
            <p>Country: {current.sys.country}</p>

          </div>
        </div>
      )}

      {/* FORECAST SECTION */}
      {/* Render only if forecast array has data */}
      {forecast.length > 0 && (
        <>
          <h2 className="text-xl font-semibold text-center mb-3">
            5-Day Forecast
          </h2>

          {/* Grid layout */}
          <div className="grid grid-cols-2 gap-4">

            {/* Loop through forecast array */}
            {forecast.map((day, index) => (

              <div
                key={index}                      // unique key for React
                className="rounded-xl p-4 text-center shadow"
                style={{
                  backgroundImage:
                    "url('https://www.weathercompany.com/wp-content/uploads/2024/01/AdobeStock_359999296-sized.jpg')",
                  backgroundSize: "cover",
                }}
              >

                {/* Date */}
                <p className="text-red-500 font-semibold">
                  {new Date(day.dt_txt).toLocaleDateString()}
                </p>

                {/* Temperature */}
                <p className="text-lg font-bold">
                  {day.main.temp}°C
                </p>

                {/* Description */}
                <p className="capitalize text-sm">
                  {day.weather[0].description}
                </p>

              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Export App so it can be used in main.jsx
export default App;