let countries = [];

// biến lưu trạng thái sắp xếp
let sortOrder = {
  name: true,
  population: true,
  area: true
};

// lấy dữ liệu quốc gia
async function fetchCountries() {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all');
    countries = await response.json();
    updateClock();   
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu quốc gia:", error);
  }
}

//hiển thị danh sách
function displayCountries(countries) {
  const countryList = document.getElementById("country-list");
  countryList.innerHTML = "";

  if (countries.length === 0) {
    countryList.innerHTML = "<p>Không tìm thấy</p>";
    return;
  }

  countries.forEach(country => {
    const languages = country.languages ? Object.values(country.languages).join(', ') : 'Không có';
    const currencies = country.currencies ? Object.values(country.currencies).map(curr => curr.name).join(', ') : 'Không có';
    const region = country.region || 'Không có';
    const subregion = country.subregion || 'Không có';
    const countryCode = country.cca2 || 'Không có';
    const capital = country.capital ? country.capital[0] : 'Không có';

    // Tạo liên kết cho quốc gia và thủ đô
    const countryLink = `<a href="https://en.wikipedia.org/wiki/${country.name.common}" target="_blank">${country.name.common}</a>`;
    const capitalLink = `<a href="https://en.wikipedia.org/wiki/${capital}" target="_blank">${capital}</a>`;
    const regionLink = `<a href="https://en.wikipedia.org/wiki/${region}" target="_blank">${region}</a>`;  // Liên kết cho châu lục

    const card = document.createElement("div");
    card.className = "country-card";
    card.innerHTML = `
      <h3>${countryLink}</h3>
      <p>Thủ đô: ${capitalLink}</p>
      <p>Dân số: ${country.population.toLocaleString()}</p>
      <p>Diện tích: ${country.area ? country.area.toLocaleString() : 'Không có'} km²</p>
      <p>Châu Lục: ${regionLink}</p>  <!-- Chèn liên kết cho châu lục -->
      <p>Khu vực: ${subregion}</p>
      <p>Mã quốc gia: ${countryCode}</p>
      <p>Ngôn ngữ: ${languages}</p>
      <p>Tiền tệ: ${currencies}</p>
      <img src="${country.flags.png}" alt="Quốc kỳ của ${country.name.common}">
    `;
    countryList.appendChild(card);
  });
}

//hiển thị tất cả
function displayAllCountries() {
  const countryList = document.getElementById("country-list");
  document.getElementById("search-query").value = ""; //đặt lại nội dung ô tìm kiếm
  countryList.style.display = "flex"; //hiển thị danh sách
  displayCountries(countries);
}

//lọc theo tên
function filterByName() {
  const query = document.getElementById("search-query").value.toLowerCase();
  const filtered = countries.filter(country => country.name.common.toLowerCase().includes(query));
  displayCountries(filtered);
}

// lọc theo thủ đô
function filterByCapital() {
  const query = document.getElementById("search-query").value.toLowerCase();
  const filtered = countries.filter(country => country.capital && country.capital[0].toLowerCase().includes(query));
  displayCountries(filtered);
}

//lọc theo ngôn ngữ
function filterByLanguage() {
  const query = document.getElementById("search-query").value.toLowerCase();
  const filtered = countries.filter(country => {
    return country.languages && Object.values(country.languages).some(lang => lang.toLowerCase().includes(query));
  });
  displayCountries(filtered);
}

//lọc tiền 
function filterByCurrency() {
  const query = document.getElementById("search-query").value.toLowerCase();
  const filtered = countries.filter(country => {
    return country.currencies && Object.values(country.currencies).some(curr => curr.name.toLowerCase().includes(query));
  });
  displayCountries(filtered);
}

//lọc châu lục
function filterByRegion() {
  const query = document.getElementById("search-query").value.toLowerCase();
  const filtered = countries.filter(country => country.region && country.region.toLowerCase().includes(query));
  displayCountries(filtered);
}

//lọc khu vực
function filterBySubregion() {
  const query = document.getElementById("search-query").value.toLowerCase();
  const filtered = countries.filter(country => country.subregion && country.subregion.toLowerCase().includes(query));
  displayCountries(filtered);
}

//sắp xếp danh sách
function sortCountries(property) {
  const sorted = [...countries].sort((a, b) => {
    let compareValue;

    if (property === 'name') {
      compareValue = a.name.common.localeCompare(b.name.common);
    } else {
      compareValue = a[property] - b[property];
    }

    return sortOrder[property] ? compareValue : -compareValue;
  });

  sortOrder[property] = !sortOrder[property];
  displayCountries(sorted);
}

//đồng hồ
function updateClock() {
  const clockElement = document.getElementById("clock");
  setInterval(() => {
    const vietnamTime = new Date().toLocaleTimeString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
    clockElement.textContent = `Giờ Việt Nam: ${vietnamTime}`;
  }, 1000);
}

async function fetchWeatherData() {
  try {
    //thông tin ip, thành phố và quốc gia
    const ipResponse = await fetch('https://ipinfo.io/json');
    const ipData = await ipResponse.json();
    const city = ipData.city;

    console.log(`IP: ${ipData.ip}`);
    console.log(`City: ${city}`);
    console.log(`Country: ${ipData.country}`);

    //thông tin thời tiết
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=b329e0daa5e69f7d935bf78f15d4d0e9`;
    const weatherResponse = await fetch(apiUrl);
    const weatherData = await weatherResponse.json();
    const weatherContent = document.getElementById('weather-content');
    if (weatherData.cod === 200) {
      weatherContent.innerHTML = `
        <h4>${weatherData.name}</h4>
        <img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png" alt="${weatherData.weather[0].description}">
        <p>${weatherData.weather[0].description}</p>
        <p>Nhiệt độ: ${weatherData.main.temp.toFixed(1)}°C</p>
        <p>Độ ẩm: ${weatherData.main.humidity}%</p>
      `;
    } else {
      weatherContent.innerHTML = "<p>Không tìm thấy thông tin thời tiết.</p>";
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    document.getElementById('weather-content').innerHTML = "<p>Lỗi khi tải dữ liệu.</p>";
  }
}

//thực hiện toàn bộ quá trình
fetchWeatherData();


//để lấy dữ liệu khi trang tải
fetchCountries();
