const cityForm = document.querySelector("form");
const card = document.querySelector(".card");
const details = document.querySelector(".details");

const updateUI = async (data) => {
  const cityDets = data.cityDets;
  const weather = data.weather;

  // Update details template
  details.innerHTML = `
        <h5 class="my-3">${cityDets.EnglishName}</h5>
        <div class="my-3">${weather.WeatherText}</div>
        <div class="display-4 my-4">
            <span>${weather.Temperature.Metric.Value}</span>
            <span>&deg;C</span>
        </div>
    `;

  // Obține imaginea de pe Unsplash
  const imageUrl = await getCityImage(cityDets.EnglishName);
  document.getElementById("city-image").src = imageUrl;

  // Obține imaginea de fundal pe baza vremii
  const backgroundImageUrl = await getWeatherBackgroundImage(weather);
  document.body.style.backgroundImage = `url(${backgroundImageUrl})`;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";

  // Remove the d-none class if present
  if (card.classList.contains("d-none")) {
    card.classList.remove("d-none");
  }
};

const updateCity = async (city) => {
  const cityDets = await getCity(city);
  const weather = await getWeather(cityDets.Key);

  return {
    cityDets,
    weather,
  };
};

// Funcția pentru obținerea imaginii orașului de la Unsplash
const getCityImage = async (city) => {
  const unsplashKey = "Q78gUqMQpxzva_H2Bhwu1Nl7jB3LAlUNG-3cRn__STM"; // Cheia API Unsplash
  const unsplashUrl = `https://api.unsplash.com/search/photos?query=${city}&client_id=${unsplashKey}`;

  try {
    const response = await fetch(unsplashUrl);
    const data = await response.json();

    if (data.results.length > 0) {
      return data.results[0].urls.regular;
    } else {
      return "https://placehold.co/400x300";
    }
  } catch (error) {
    console.error("Error fetching image:", error);
    return "https://placehold.co/400x300";
  }
};

const getWeatherBackgroundImage = async (weather) => {
  const unsplashKey = "Q78gUqMQpxzva_H2Bhwu1Nl7jB3LAlUNG-3cRn__STM";

  let query = "";

  if (weather.WeatherText.toLowerCase().includes("rain")) {
    query = "rainy beach";
  } else if (
    weather.WeatherText.toLowerCase().includes("sun") ||
    weather.Temperature.Metric.Value > 25
  ) {
    query = "sunny beach";
  } else if (
    weather.WeatherText.toLowerCase().includes("cloud") ||
    weather.Temperature.Metric.Value <= 25
  ) {
    query = "cloudy park";
  } else if (weather.Temperature.Metric.Value < 0) {
    query = "snowy mountain";
  } else {
    query = "weather";
  }

  const unsplashUrl = `https://api.unsplash.com/search/photos?query=${query}&client_id=${unsplashKey}`;

  try {
    const response = await fetch(unsplashUrl);
    const data = await response.json();

    if (data.results.length > 0) {
      return data.results[0].urls.full;
    } else {
      return "https://placehold.co/800x600";
    }
  } catch (error) {
    console.error("Error fetching background image:", error);
    return "https://placehold.co/800x600";
  }
};
cityForm.addEventListener("submit", (e) => {
  // Default action
  e.preventDefault();
  // Get city value
  const city = cityForm.city.value.trim();
  cityForm.reset();

  // Update new city
  updateCity(city)
    .then((data) => {
      updateUI(data);
      console.log(JSON.stringify(data, null, 2)); // Logăm un JSON formatat
    })
    .catch((err) => console.log(err));
});
