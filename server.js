const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const bodyParser = require('body-parser')
const cors = require('cors')
// const { BSONRegExp } = require('bson') // what is this????
// const ejs = require('ejs')
require('dotenv').config()

// NOTES //
//We whitelisted all IP addresses to allow access from anywhere

const PORT = 3001

app.set('view engine','ejs')
app.use(express.static('public'))
app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended : true }))
app.use(bodyParser.json())

let db
    dbName = 'garbage-disposal-api',
    dbConnectionStr = process.env.MONGO_DB_KEY

MongoClient.connect(dbConnectionStr, { useUnifiedTopology : true })
.then(client => {
    console.log(`Connected to ${dbName} Database`)
    db = client.db('garbage-disposal-api')
})


app.get('/', (req, res)=>{
    db.collection('nagai-city-data').find().toArray()
    .then(results => {
      res.render('index.ejs', { garbage: results })
    })
    .catch(error => {console.error(error)})
})

// app.post('/garbages', (req, res) =>{
//     quotesCollection.insertOne(req.body)
//     .then(result => {
//         console.log(result)
//         res.redirect('/')
//     })
//     .catch(error => console.error(error))
// })

app.listen(process.env.PORT || PORT, () => {
    console.log('Sever is running.')
})


app.get('/search', async(request,response) => {
    try {
        //sending search object to mongodb to have mongo search the db
        let result = await collection.aggregate([
            {
                "$search" : {
                    "autocomplete" : {
                        "query": `${request.query.query}`,
                        "path":"title",
                        "fuzzy": {
                            "maxEdits":2,
                            "prefixLength":3
                        }
                    }
                }
            },
            { 
                $limit : 10 
            }
        ]).toArray()
        console.log(result)
        response.send(result)
    } catch(error){
        response.status(500).send({message: error.message})
    }
})

//get request when the user actually selects an item, bring back the information from the selection
app.get('/get/:id',async (request,response)=> {
    try{
        let result = await collection.findOne({
            //sending the object id to mongo for the document that I want to find 
            //object id is the same as the id parameter that I'm passing in
            '_id': ObjectId(request.params.id)
        })
        //send result back if the async function was fulfilled 
        response.send(result)
    }catch(error){
        response.status(500).send({message: error.message})

    }
})