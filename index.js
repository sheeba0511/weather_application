// 436cab735d864ce3b8740332250805
// Sheeba05
// https://www.weatherapi.com/my/
// https://www.weatherapi.com/

// https://api.openweathermap.org/data/2.5/forecast?q={CITY_NAME}&appid={API_KEY}&units=metric
const API_KEY = "436cab735d864ce3b8740332250805";
const docs = document.getElementById("detail_card");
const img = document.getElementById("rainy_img_logo");
const forecastFourDays = document.getElementById("forecast_main");
const dashboard_data = document.getElementById("dashboard_main");
const forecast_data = document.getElementById("forecast_heading");
function formSubmit() {
  const cityName = document.getElementById("searchbar_input_in")?.value;
  updateCard(cityName);
  forecastData(cityName);
}

function updateCard(cityName) {
  if (cityName) {
    const url = `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${cityName}`;
    fetch(url)
      .then((response) => response?.json())
      .then((data) => {
        const img_url = data?.current?.condition?.icon;
        if (img_url) {
          img.src = `https:${img_url}`;
        }
        docs.innerHTML = `
         <h3 class="dashboard_main_heading">${data?.location?.name}</h3>
                <p class="dashboard_main_para">Temperature: ${data?.current?.temp_c}°C</p>
                <p class="dashboard_main_para">Wind: ${data?.current?.wind_mph}M/S</p>
                <p class="dashboard_main_para">Humidity: ${data?.current?.humidity}%</p>
           
          `;
      })
      .catch((error) => console?.error(error));
  } else {
    alert("Please enter city name");
  }
}

let latitude = null;
let longitude = null;

function getLocation() {
  if (navigator?.geolocation) {
    navigator?.geolocation?.getCurrentPosition(
      geolocationSuccess,
      geolocationError
    );
  } else {
    dashboard_data.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function geolocationSuccess(position) {
  latitude = position?.coords?.latitude;
  longitude = position?.coords?.longitude;
  fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
  )
    .then((response) => response?.json())
    .then((data) => {
      updateCard(data?.address?.state_district);
      forecastData(data?.address?.state_district);
    })
    .catch((error) => ("Error fetching address:", error));
}

function geolocationError() {
  alert("Sorry, no position available.");
}

function forecastData(cityName) {
  if (cityName) {
    const url = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityName}&days=5`;

    fetch(url)
      .then((response) => response?.json())
      .then((data) => {
        forecastFourDays.innerHTML = "";
        forecast_data.innerText = `${data?.forecast?.forecastday?.length} Day Forecast`;
        console.log(forecast_data.innerText);
        for (let item of data?.forecast?.forecastday) {
          const createDiv = document.createElement("div");

          createDiv.innerHTML = `
               <div class="forecast_text" >
              <h4 class="forecast_text_para">Date:${item?.date}</h4>
              <img
                src=https:${item?.day?.condition?.icon}
                alt="forecast_img"
              />
              <p class="forecast_text_para">Temp: ${item?.day?.maxtemp_c}°C</p>
              <p class="forecast_text_para">Wind: ${item?.day?.maxwind_mph}M/S</p>
              <p class="forecast_text_para">Humidity:${item?.day?.avghumidity}%</p>
            </div>
          `;
          forecastFourDays.appendChild(createDiv);
        }
      })
      .catch((error) => console?.error(error));
  } else {
  }
}

// Theming
const themeToggle = document.getElementById("theming_toggle");
const themeToggleText = document.getElementById("theming_toggle_text");
const darkMode = {
  "--menu-color": "#1A1E23",
  "--heading-color": "#F6FAFF",
  "--hint-color": "#87888C",
  "--primary-card": "#26282C",
  "--secondary-card": "#373639",
  "--primary-button": "#E84EA2",
  "--secondary-button": "#505256",
  "--background-color": "#1f2228",
  "--input-bg-color": "#373737",
  "--border-color": "#2d2f31",
};
const lightMode = {
  "--menu-color": " #efefef",
  "--heading-color": " #000000",
  "--hint-color": " #58585b",
  "--primary-card": "#f9f9f9",
  "--secondary-card": "#f0eff2",
  "--primary-button": " #e84ea2",
  "--secondary-button": "#ffffff",
  "--background-color": "#dee0e2",
  "--input-bg-color": "#f0eff2",
  "--border-color": "#ece9ec",
};

function themingFn() {
  console.log(themeToggle.checked);
  let activeTheme = lightMode;
  let textValue = "Switch to dark mode";

  if (themeToggle.checked) {
    activeTheme = darkMode;
    textValue = "Switch to light mode";
  }
  themeToggleText.innerText = textValue;
  console.log(activeTheme);
  for (const [key, value] of Object.entries(activeTheme)) {
    document.documentElement.style.setProperty(key, value);
  }
}
