# sql-proju

1. Tee "automyynti" niminen tietokanta terminaaliin: "createdb automyynti"

2. kirjoita terminaaliin: "psql automyynti"

3. kopioi cars.sql tiedostosta rivit 1-40 ja liitä ne tietokantaan

4. avaa "random_data.js" tiedosto ja laita sinne riville 167 for looppiin kohtaan:
   "i < 20" -> "i < omamäärä"
   omamäärä tarkoittaa kuinka monta käyttäjää ja listausta haluat tietokantaan,
   eli laita siihen kuinka monta riviä dataa haluat esim: 100
   tiedosto siis tekee automaattisesti dataa tietokantaan.
   viimeiseksi terminaaliin: "node random_data.js"

5. käynnistä serveri: "node server.js"

6. avaa http://127.0.0.1:3000
