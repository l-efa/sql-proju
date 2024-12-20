// tämä scripti tekee databaseen halutun määrän käyttäjiä ja listauksia autoista satunnaisesti
// ottamalla jokaisesta alla olevasta arraystä yhden arvon
// muuta rivin 167 for loopista "i < 20" arvo (20) haluamaksi luvuksi (listauksien määrä tietokannassa)
import pg from "pg";

const { Client } = pg;

const client = new Client({
  connectionString: "postgress://localhost/automyynti",
});

await client.connect();

let names = [
  "Jaakko",
  "Juuso",
  "Anna",
  "Kati",
  "Tomi",
  "Timo",
  "Jesse",
  "Sanna",
  "Matti",
  "Pekka",
  "Juha",
  "Pinja",
  "Jalmari",
  "Paula",
  "Vilma",
  "Venla",
  "Jani",
  "Markus",
  "Teemu",
  "Henri",
  "Pertti",
];

let lastnames = [
  "Virtanen",
  "Korhonen",
  "Mäkinen",
  "Mäkelä",
  "Heikkinen",
  "Koskinen",
  "Lehtonen",
  "Heinonen",
  "Kinnunen",
  "Salonen",
  "Turunen",
  "Salo",
  "Karjalainen",
  "Jokinen",
  "Savolainen",
];

let emails = ["outlook.com", "gmail.com"];

let phonenumbers = ["040", "050"];

let carBrands = [
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

let doors = [2, 4];

let colors = [
  "Green",
  "Blue",
  "White",
  "Black",
  "Red",
  "Grey",
  "Brown",
  "Beige",
];

let years = [2005, 2008, 2009, 2011, 2013, 2014, 2015, 2017, 2018, 2020, 2022];

let kilometers = [
  15000, 30000, 50000, 75000, 90000, 110000, 130000, 150000, 175000, 200000,
  250000, 300000,
];

let transmissions = ["Manual", "Automatic"];

let fuelTypes = ["Petrol", "Diesel"];

let locations = [
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
  2000, 3000, 4500, 6000, 6500, 7000, 9000, 11500, 13000, 17000, 21000, 28000,
  35000, 45000, 70000, 100000,
];

class User {
  constructor(user_name, user_lastname, user_email, user_phonenumber) {
    (this.user_name = user_name),
      (this.user_lastname = user_lastname),
      (this.user_email = user_email),
      (this.user_phonenumber = user_phonenumber);
  }
}

class Car {
  constructor(
    owner_name,
    owner_lastname,
    user_id,
    brand,
    doors,
    color,
    year,
    kilometers,
    transmission,
    fuel,
    location,
    price,
    title,
    description
  ) {
    (this.owner_name = owner_name),
      (this.owner_lastname = owner_lastname),
      (this.user_id = user_id),
      (this.brand = brand),
      (this.doors = doors),
      (this.color = color),
      (this.year = year),
      (this.kilometers = kilometers),
      (this.transmission = transmission),
      (this.fuel = fuel),
      (this.location = location),
      (this.price = price),
      (this.title = title),
      (this.description = description);
  }
}

class Image {
  constructor(listing_id, image_url) {
    (this.listing_id = listing_id), (this.image_url = image_url);
  }
}

// for looppi jossa tehdään haluttu määrä listauksia ja käyttäjiä
for (let i = 1; i < 500; i++) {
  let name = names[Math.floor(Math.random() * names.length)];

  let lastname = lastnames[Math.floor(Math.random() * lastnames.length)];

  let email = `${name}.${lastname}${Math.floor(Math.random() * 49999)}@${
    emails[Math.floor(Math.random() * emails.length)]
  }`;

  let phonenumber = `${
    phonenumbers[Math.floor(Math.random() * phonenumbers.length)]
  }${Math.floor(Math.random() * 8999999) + 1000000}`;

  let user_id = i;

  let brand = carBrands[Math.floor(Math.random() * carBrands.length)];

  let doorCount = doors[Math.floor(Math.random() * doors.length)];

  let color = colors[Math.floor(Math.random() * colors.length)];

  let year = years[Math.floor(Math.random() * years.length)];

  let kilometer = kilometers[Math.floor(Math.random() * kilometers.length)];

  let transmission =
    transmissions[Math.floor(Math.random() * transmissions.length)];

  let fuel = fuelTypes[Math.floor(Math.random() * fuelTypes.length)];

  let location = locations[Math.floor(Math.random() * locations.length)];

  let price = prices[Math.floor(Math.random() * prices.length)];

  let title = `${brand} ${price}€ (${location})`;

  let description = `Good condition ${year} ${brand} with ${kilometer} kilometers `;

  const car = new Car(
    name,
    lastname,
    user_id,
    brand,
    doorCount,
    color,
    year,
    kilometer,
    transmission,
    fuel,
    location,
    price,
    title,
    description
  );

  const user = new User(name, lastname, email, phonenumber);

  let listing_id = i;
  let image_url = `/${color.toLowerCase()}_car.jpg`;

  const image = new Image(listing_id, image_url);

  console.log(car);
  console.log(user);
  console.log(image);

  // käyttäjät tietokantaan
  const ret = await client.query(
    "INSERT INTO users(first_name, last_name, email, phone_number) VALUES($1, $2, $3, $4)",
    [user.user_name, user.user_lastname, user.user_email, user.user_phonenumber]
  );

  // listaukset tietokantaan
  const ret2 = await client.query(
    "INSERT INTO listings(user_id, car_type, car_brand, car_year, car_fueltype, car_transmission, car_color, car_kilometers, car_doorcount, car_price, listing_location, listing_title, listing_description) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)",
    [
      car.user_id,
      "Henkilöauto",
      car.brand,
      car.year,
      car.fuel,
      car.transmission,
      car.color,
      car.kilometers,
      car.doors,
      car.price,
      car.location,
      car.title,
      car.description,
    ]
  );

  // kuvat tietokantaan
  const ret3 = await client.query(
    "INSERT INTO images(listing_id, image_url) VALUES($1, $2)",
    [image.listing_id, image.image_url]
  );
}

await client.end();
