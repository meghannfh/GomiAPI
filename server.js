const express = require("express");
const app = express();
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
const { response } = require("express");
// const { request } = require("http")
// const ejs = require('ejs')
require('dotenv').config({ path: './config/.env' })

const PORT = 3001;

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let db;
// let dbName = "garbage-disposal-api"
let dbName = "nagaiGomi2"
let dbConnectionStr = process.env.DB_STRING2

MongoClient.connect(dbConnectionStr)
.then(
  (client) => {
    console.log(`Connected to ${dbName} Database`);
    db = client.db("nagaiGomi2");
  }
);

app.get("/", (req, res) => {
  res.render("index.ejs")
});

app.get("/search", async (request, response) => {
  try {
    // console.log(req.query);
    let result = await db.collection("nagai-gomi").aggregate([
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
    let result = await db.collection("nagai-gomi").findOne({
      "_id": ObjectId(request.params.id)
    });
    console.log(result);
    response.send(result);
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
});

app.listen(process.env.PORT || PORT, () => {
  console.log("Server is running.");
});

