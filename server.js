const express = require("express");
const app = express();
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
const { response } = require("express");
const { request } = require("http")
// const ejs = require('ejs')
require("dotenv").config();

const PORT = 3001;

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let db;
(dbName = "garbage-disposal-api"), (dbConnectionStr = process.env.MONGO_DB_KEY);

app.get("/search", async (request, response) => {
  try {
    // console.log(req.query);
    let result = await db
      .collection("nagai-city-data")
      .aggregate([
        {
          $search: {
            autocomplete: {
              query: `${req.query.query}`,
              path: "name",
              fuzzy: {
                maxEdits: 2,
                prefixLength: 2,
              },
            },
          },
        },
      ])
      .toArray();

    // let test = await db
    //   .collection("nagai-city-data")
    //   .find({ name: req.query.term });
    // console.log(test);
    res.send(result);
  } catch (error) {
    response.status(500).send({ message: error.message });
    console.log(error)
  }
});

app.get("/get/:id", async (request, response) => {
  try {
    console.log(req.params);
    let result = await db.collection("nagai-city-data").findOne({
      _id: ObjectId(req.params.id),
    });
    console.log(result);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
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

app.get("/search", async (request, response) => {
  try {
    //sending search object to mongodb to have mongo search the db
    let result = await collection
      .aggregate([
        {
          $search: {
            autocomplete: {
              query: `${request.query.query}`,
              path: "title",
              fuzzy: {
                maxEdits: 2,
                prefixLength: 3,
              },
            },
          },
        },
        {
          $limit: 10,
        },
      ])
      .toArray();
    console.log(result);
    response.send(result);
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
});
