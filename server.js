import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Client } = pg;

const client = new Client({
  connectionString: "postgress://localhost/automyynti",
});

console.log("hello");
await client.connect();

console.log("Hello1");

const fastify = Fastify({
  logger: true,
});

/*fastify.get("/", async function handler(request, reply) {
  //array literal
  const array = [];

  //object literal
  return {
    hello: "kissa",
  };
});*/

/*fastify.get("/", async (req, res) => {
  const page = req.query.page;

  const ret = await client.query(
    "SELECT * FROM person ORDER BY id ASC LIMIT 100 OFFSET $1",
    [(page - 1) * 100]
  );
  return { rows: ret.rows };
});*/

/*fastify.get("/", async (req, res) => {
  const carmodel = req.params.carmodel;

  const ret = await client.query(
    "SELECT * FROM listings JOIN users ON (listings.user_id = users.user_id) WHERE car_brand = $1",
    [carmodel]
  );
  console.log("ret: ", ret);
  console.log("rows: ", { rows: ret.rows });

  if (ret.rows) {
    console.log(ret.rows);
    return { rows: ret.rows };
  } else {
    console.log("no matches!");
  }
});*/

// joku koodi static html filua varten
fastify.register(fastifyStatic, {
  root: path.join(__dirname, "public"),
  prefix: "/",
});

// täältä api saa käyttäjän haku parametrit ja hakee niillä tietokannasta kaikki listaukset niillä parametreillä
fastify.post("/api/parameters", async (req, res) => {
  try {
    const parameters = req.body;
    console.log("Received parameters:", parameters);
    console.log("body", req.body);

    let query =
      "SELECT * FROM listings JOIN users ON(listings.user_id = users.user_id) JOIN images ON (listings.listing_id = images.image_id) WHERE ";
    let values = [];
    let i = 1;
    let firstCondition = true;

    // rakennetaan query jokaisella parametrilla
    if (Object.entries(parameters).length > 0) {
      for (const [key, value] of Object.entries(parameters)) {
        console.log(key);
        console.log(value);

        if (firstCondition) {
          firstCondition = false;
        } else {
          query += " AND ";
        }

        // queryn rakennusta riippuen mitä parametrejä
        // jotkut parametrit ja parametri parit vaativat eri query rakenteen
        if (key === "car_min_kilometer" && parameters.car_max_kilometer) {
          query += `car_kilometers BETWEEN $${i} AND $${i + 1}`;
          values.push(
            parameters.car_min_kilometer,
            parameters.car_max_kilometer
          );
          i += 2;
        } else if (key === "car_min_kilometer") {
          query += `car_kilometers >= $${i}`;
          values.push(parameters.car_min_kilometer);
          i++;
        } else if (key === "car_max_kilometer") {
          query += `car_kilometers <= $${i}`;
          values.push(parameters.car_max_kilometer);
          i++;
        } else if (key === "car_min_year" && parameters.car_max_year) {
          query += `car_year BETWEEN $${i} AND $${i + 1}`;
          values.push(parameters.car_min_year, parameters.car_max_year);
          i += 2;
        } else if (key === "car_min_year") {
          query += `car_year >= $${i}`;
          values.push(parameters.car_min_year);
          i++;
        } else if (key === "car_max_year") {
          query += `car_year <= $${i}`;
          values.push(parameters.car_max_year);
          i++;
        } else if (key === "car_min_price" && parameters.car_max_price) {
          query += `car_price BETWEEN $${i} AND $${i + 1}`;
          values.push(parameters.car_min_price, parameters.car_max_price);
          i += 2;
        } else if (key === "car_min_price") {
          query += `car_price >= $${i}`;
          values.push(parameters.car_min_price);
          i++;
        } else if (key === "car_max_price") {
          query += `car_price <= $${i}`;
          values.push(parameters.car_max_price);
          i++;
        } else {
          query += `${key} = $${i}`;
          values.push(value);
          i++;
        }
      }
    } else {
      console.log("No parameters provided.");
      return res.status(400).send({ error: "No filter parameters provided" });
    }

    console.log(query);

    const result = await client.query(query, values);

    // palautetaan tietokannasta saadut listaukset käyttäjälle
    return { rows: result.rows };
  } catch (error) {
    console.error("Error processing filters:", error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
});

try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
