DROP TABLE IF EXISTS images CASCADE;
DROP TABLE IF EXISTS listings CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    user_id BIGINT NOT NULL GENERATED ALWAYS AS IDENTITY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(255),
    PRIMARY KEY(user_id)
);

CREATE TABLE listings (
    listing_id BIGINT NOT NULL GENERATED ALWAYS AS IDENTITY,
    user_id BIGINT NOT NULL REFERENCES users(user_id),
    car_type VARCHAR(255) NOT NULL,
    car_brand VARCHAR(255) NOT NULL,
    car_model VARCHAR(255),
    car_year INT NOT NULL,
    car_fueltype VARCHAR(255),
    car_transmission VARCHAR(255),
    car_color VARCHAR(255) NOT NULL,
    car_kilometers INT NOT NULL,
    car_doorcount INT,
    car_price INT NOT NULL,
    listing_location VARCHAR(255) NOT NULL,
    listing_title VARCHAR(255) NOT NULL,
    listing_description VARCHAR(1000),    

    PRIMARY KEY(listing_id)
);

CREATE TABLE images (
    image_id BIGINT NOT NULL GENERATED ALWAYS AS IDENTITY,
    listing_id BIGINT NOT NULL REFERENCES listings(listing_id),
    image_url VARCHAR(255) NOT NULL,

    PRIMARY KEY(image_id)
);

SELECT *
FROM listings 
JOIN users ON(listings.user_id = users.user_id) 
JOIN images ON (listings.listing_id = images.image_id)
WHERE car_brand = 'Subaru';

INSERT INTO users(first_name, last_name, email, phone_number) VALUES ('Leevi', 'Sahi', 'kissat.koiria@gmail.com', '040011223344');

INSERT INTO listings(user_id, car_type, car_brand, car_model, car_year, car_fueltype, car_transmission, car_color,
 price, listing_location, listing_title, listing_description) VALUES (1, 'Henkilöauto', 'Toyota', 'iQ', 2008,
  'Bensiini', 'Automaatti', 'Valkoinen', 7500, 'Helsinki', 'Toyota iQ 7500€', 'Hyvin pidetty toyota iQ yhdellä entisellä omistajalla');

  INSERT INTO listings(user_id, car_type, car_brand, car_model, car_year, car_fueltype, car_transmission, car_color,
 price, listing_location, listing_title, listing_description) VALUES (1, 'Henkilöauto', 'Volkswagen', 'Golf', 2018,
  'Diesel', 'Automaatti', 'Harmaa', 18000, 'Helsinki', 'Volkswagen Golf 2018 18,000€', 'Hyvin huolehdittu Volkswagen Golf nyt 18,000€');