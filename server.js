const express = require("express");
const app = express();
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
const { response } = require("express");
const { request } = require("http")
// const ejs = require('ejs')
require("dotenv").config();

const PORT = 3001;

// app.set("view engine", "ejs");
// app.use(express.static("public"));

let db,
    dbName = 'garbage-disposal-api',
    dbConnectionStr = process.env.MONGO_DB_KEY,
    collection

MongoClient.connect(dbConnectionStr)
  .then(client => {
    console.log(`Connected to ${dbName} Database`);
    db = client.db(dbName)
    collection = db.collection('nagai-city-data')
  });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.get("/", (req, res) => {
//   db.collection("nagai-city-data")
//     .find()
//     .toArray()
//     .then((results) => {
//       res.render("index.ejs", { garbage: results });
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// });

app.get("/search", async (request, response) => {
  try {
    let result = await collection.aggregate([
        {
          "$search": {
            //if search index is not called default then we need to include it here
            "autocomplete": {
              "query": `${request.query.query}`,
              "path": "name",
              "fuzzy": {
                "maxEdits": 2,
                "prefixLength": 3
              }
            }
          }
        }]).toArray();
        console.log(result)
    response.send(result);

  } catch (error) {
    response.status(500).send({ message: error.message });
    console.log(error)
  }
});

app.get("/get/:id", async (request, response) => {
  try {
    let result = await collection.findOne({
      "_id": ObjectId(request.params.id)
    })
    response.send(result);
    console.log(result)
  } catch (error) {
    response.status(500).send({message: error.message})
    console.log(error)
  }
});

// app.post("/garbages", (req, res) => {
//   quotesCollection
//     .insertOne(req.body)
//     .then((result) => {
//       console.log(result);
//       res.redirect("/");
//     })
//     .catch((error) => console.error(error));
// });

app.listen(process.env.PORT || PORT, () => {
  console.log("Sever is running.");
});
