const searchInput = document.querySelector('#search');
const container = document.querySelector('.container');
const body = document.querySelector('.main');
const loader = document.querySelector('.loader');
const formContainer = document.querySelector('.form-container');
const title = document.querySelector('.title');
const miParrafo = document.querySelector('.parrafo');
const listCountries = document.querySelector('.lista-de-paises');

let countries = [];
const apiKey = '8f42c3af4748cfbd5ea29d753ae1ab71';

const getCountries = async () => {
  const response = await fetch('https://restcountries.com/v3.1/all');
  const countriesData = await response.json();
  countries = countriesData;
};

getCountries();

searchInput.addEventListener('input', async (event) => {
  const searchTerm = event.target.value.toLowerCase().trim();

  if (!searchTerm) {
    hideParagraph();
    listCountries.innerHTML = '';
    return;
  }

  const filteredCountries = countries.filter((country) => {
    const countryName = country.name.common.toLowerCase();
    return countryName.includes(searchTerm);
  });

  if (filteredCountries.length > 10) {
    showParagraph();
  } else {
    hideParagraph();
    displayCountries(filteredCountries);
  }
});

function displayCountries(countries) {
  listCountries.innerHTML = '';
  countries.forEach((country) => {
    const flagURL = country.flags.png;
    const flagElement = document.createElement('img');
    flagElement.src = flagURL;
    flagElement.alt = country.name.common;
    listCountries.appendChild(flagElement);

    const countryNameElement = document.createElement('span');
    countryNameElement.classList.add('country-name');
    countryNameElement.innerText = country.name.common;
    listCountries.appendChild(countryNameElement);

    const capitalElement = document.createElement('p');
    capitalElement.classList.add('capital');
    capitalElement.innerText = `Capital: ${country.capital}`;
    listCountries.appendChild(capitalElement);

    const populationElement = document.createElement('p');
    populationElement.classList.add('population'); 
    const formattedPopulation = country.population.toLocaleString(); 
    populationElement.innerText = `Population: ${formattedPopulation}`;
    listCountries.appendChild(populationElement);

    const weatherElement = document.createElement('span');
    weatherElement.classList.add('weather');

    countryNameElement.addEventListener('click', async () => {
      const lat = country.latlng[0];
      const lon = country.latlng[1];

      const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`);
      const weatherData = await weatherResponse.json();

      weatherElement.innerText = `Temperature: ${weatherData.main.temp}°C`;
    });

    listCountries.appendChild(weatherElement);
  });
}

function showParagraph() {
  miParrafo.style.display = 'block';
}

function hideParagraph() {
  miParrafo.style.display = 'none';
}
