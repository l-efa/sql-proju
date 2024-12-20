let brand_select = document.getElementById("car_brand");
let color_select = document.getElementById("car_color");
let min_kilometer_select = document.getElementById("car_min_kilometer");
let max_kilometer_select = document.getElementById("car_max_kilometer");
let min_year_select = document.getElementById("car_min_year");
let max_year_select = document.getElementById("car_max_year");
let fueltype_select = document.getElementById("car_fueltype");
let location_select = document.getElementById("listing_location");
let min_price_select = document.getElementById("car_min_price");
let max_price_select = document.getElementById("car_max_price");
let search_cars_button = document.getElementById("cars_search");
let selects = document.querySelectorAll("select");

// taulukot select arvoille
let carBrands = [
  "Merkki",
  "Volkswagen",
  "Ford",
  "Volvo",
  "Mazda",
  "BMW",
  "Mercedes",
  "Toyota",
  "Nissan",
  "Opel",
  "Subaru",
  "Peugeot",
  "Citroen",
  "Audi",
  "Seat",
];

let colors = [
  "Väri",
  "Green",
  "Blue",
  "White",
  "Black",
  "Red",
  "Grey",
  "Brown",
  "Beige",
];

let kilometers = [
  "Kilometrit",
  "15000",
  "30000",
  "50000",
  "75000",
  "90000",
  "110000",
  "130000",
  "150000",
  "175000",
  "200000",
  "250000",
  "300000",
];

let years = [
  "Vuosimalli",
  "2005",
  "2008",
  "2009",
  "2011",
  "2013",
  "2014",
  "2015",
  "2017",
  "2018",
  "2020",
  "2022",
];

let fuelTypes = ["Käyttövoima", "Petrol", "Diesel"];

let locations = [
  "Sijainti",
  "Helsinki",
  "Vantaa",
  "Espoo",
  "Tampere",
  "Jyväskylä",
  "Turku",
  "Rovaniemi",
  "Rauma",
  "Kotka",
];

let prices = [
  "Hinta",
  "2000",
  "3000",
  "4500",
  "6000",
  "6500",
  "7000",
  "9000",
  "11500",
  "13000",
  "17000",
  "21000",
  "28000",
  "35000",
  "45000",
  "70000",
  "100000",
];

// funktio jolla rakennetaan select taulukko
function getArrayValues(arr, element) {
  for (let i = 0; i < arr.length; i++) {
    let item = document.createElement("option");
    item.value = arr[i];
    item.textContent = arr[i];

    element.appendChild(item);
  }
}

getArrayValues(carBrands, brand_select);
getArrayValues(colors, color_select);
getArrayValues(kilometers, min_kilometer_select);
getArrayValues(kilometers, max_kilometer_select);
getArrayValues(years, min_year_select);
getArrayValues(years, max_year_select);
getArrayValues(fuelTypes, fueltype_select);
getArrayValues(locations, location_select);
getArrayValues(prices, min_price_select);
getArrayValues(prices, max_price_select);

// eventlistener napille
search_cars_button.addEventListener("click", async function () {
  let parameters = {};

  for (let i = 0; i < selects.length; i++) {
    console.log(`${selects[i].id}: ${selects[i].value}`);

    if (
      selects[i].value != "Merkki" &&
      selects[i].value != "Väri" &&
      selects[i].value != "Kilometrit" &&
      selects[i].value != "Käyttövoima" &&
      selects[i].value != "Sijainti" &&
      selects[i].value != "Hinta" &&
      selects[i].value != "Vuosimalli"
    ) {
      parameters[selects[i].id] = selects[i].value;
    }
  }
  console.log(parameters);

  // lähetetään valitut parametrile apille
  try {
    const response = await fetch("http://127.0.0.1:3000/api/parameters", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Ensure you're sending JSON
      },
      body: JSON.stringify(parameters), // Convert the parameters object to JSON
    });

    const data = await response.json();
    console.log("Response from server:", data);
    if (data.rows.length > 0) {
      console.log(data);
      makeListings(data);
    }
  } catch (error) {
    console.error("Error sending data:", error);
  }
});

let listings_container = document.getElementById("listings_container");

// funktio jolla tehdään elementti jokaiselle listaukselle jotka saatiin tietokannasta
function makeListings(data) {
  listings_container.innerHTML = "";
  for (let i = 0; i < data.rows.length; i++) {
    let listing_item = document.createElement("div");
    listing_item.classList.add("listing-item");

    let image_div = document.createElement("div");
    image_div.classList.add("image-div");
    let img = document.createElement("img");
    img.src = `./images${data.rows[i].image_url}`;
    image_div.appendChild(img);
    listing_item.appendChild(image_div);

    let text_div = document.createElement("div");
    text_div.classList.add("text-div");
    let text_div_brand = document.createElement("h3");
    text_div_brand.textContent = data.rows[i].car_brand;
    let text_div_price = document.createElement("span");
    text_div_price.textContent = `${data.rows[i].car_price}€`;
    text_div_brand.appendChild(text_div_price);
    let text_div_details = document.createElement("h5");
    text_div_details.textContent = `${data.rows[i].car_year} * ${data.rows[i].car_kilometers} * ${data.rows[i].car_fueltype} * ${data.rows[i].car_transmission} * ${data.rows[i].car_doorcount} * ${data.rows[i].car_color}`;
    text_div.appendChild(text_div_brand);
    text_div.appendChild(text_div_details);
    listing_item.appendChild(text_div);

    let footer_div = document.createElement("div");
    footer_div.classList.add("footer-div");
    let footer_div_p = document.createElement("p");
    footer_div_p.textContent = `${data.rows[i].listing_location}, `;
    let footer_div_name = document.createElement("span");
    footer_div_name.textContent = `${data.rows[i].first_name} ${data.rows[i].last_name}`;
    footer_div_p.appendChild(footer_div_name);
    footer_div.appendChild(footer_div_p);
    listing_item.appendChild(footer_div);

    listings_container.appendChild(listing_item);
  }
}
