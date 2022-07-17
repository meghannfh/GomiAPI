const express = require("express");
const app = express();
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
const { response } = require("express");
// const { request } = require("http")
// const ejs = require('ejs')
require("dotenv").config();

const PORT = 3001;

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let db;
(dbName = "garbage-disposal-api"), (dbConnectionStr = 'mongodb+srv://gomisorter:LJpMVxeGPYsSAGfg@cluster0.nf9ipwl.mongodb.net/?retryWrites=true&w=majority');

MongoClient.connect(dbConnectionStr)
.then(
  (client) => {
    console.log(`Connected to ${dbName} Database`);
    db = client.db("garbage-disposal-api");
  }
);

app.get("/", (req, res) => {
  res.render("index.ejs")
});

app.get("/search", async (request, response) => {
  try {
    // console.log(req.query);
    let result = await db.collection("nagai-city-data").aggregate([
        {
          "$search": {
            "autocomplete": {
              "query": `${request.query.query}`,
              "path": "name",
              "fuzzy": {
                "maxEdits": 2,
                "prefixLength": 2
              }
            }
          }
        }
      ]).toArray();
    response.send(result);
  } catch (error) {
    response.status(500).send({ message: error.message });
    console.log(error)
  }
});

app.get("/get/:id", async (request, response) => {
  try {
    console.log(request.params);
    let result = await db.collection("nagai-city-data").findOne({
      "_id": ObjectId(request.params.id)
    });
    console.log(result);
    response.send(result);
  } catch (error) {
    response.status(500).send({ message: error.message });
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
  console.log("Server is running.");
});

