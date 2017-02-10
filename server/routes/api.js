const express = require('express');
const router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const mongo = require('mongodb');

var url = 'mongodb://localhost:27017/patent_backend';


//connect to DB
MongoClient.connect(url, (err, database) => {
  
  if (err) return console.log(err);
  console.log("Connected successfully to server");
  db = database;
})

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

router.get('/patents', (req, res) => {
  var cursor = db.collection('patents').find({}).toArray(function(err, results){
    res.json(results);
  });
});


router.get('/patent/:id', (req, res) => {
  o_id = new mongo.ObjectID(req.params.id);
  var cursor = db.collection('patents').find({'_id': o_id}).toArray(function(err, results){
    res.json(results);
  });
});

module.exports = router;