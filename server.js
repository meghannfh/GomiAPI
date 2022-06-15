const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()

const PORT = 3001

app.set('view engine','ejs')
app.use(express.static('public'))
app.use(cors())
app.use(urlencoded({ extended: true }))
app.use(json())

let db,
    dbName = 'nagai-city-data',
    dbConnectionStr = process.env.MONGO_DB_KEY

MongoClient.connect(dbConnectionStr, { useUnifiedTopology : true })
.then(client => {
    console.log(`Connected to ${dbName} Database`)
    db = client.db(dbName)
})


app.get('/', (req, res)=>{
    res.json()
})



app.listen(process.env.PORT || PORT, () => {
    console.log('Sever is running.')
})