const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const bodyParser = require('body-parser')
const cors = require('cors')
const { BSONRegExp } = require('bson')
const ejs = require('ejs')
require('dotenv').config()

const PORT = 3001

app.set('view engine','ejs')
app.use(express.static('public'))
app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended : true }))
app.use(bodyParser.json())

let db
    dbName = 'nagai-city-data',
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

app.post('/garbages', (req, res) =>{
    quotesCollection.insertOne(req.body)
    .then(result => {
        console.log(result)
        res.redirect('/')
    })
    .catch(error => console.error(error))
})

app.listen(process.env.PORT || PORT, () => {
    console.log('Sever is running.')
})