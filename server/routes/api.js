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



function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}


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

router.post('/user/register', (req, res) => {
  var user = req.body;
  if (!user.email || isEmpty(user.domains)) {
    res.status(400);
    res.json({
      "error": "Bad Data"
    });
  } else {
    var cursor = db.collection('users').find({'email': user.email}).toArray(function(err, results){
      var len = results.length;
      if (len == 0) {
        db.collection('users').insertOne(user, function(err, insertResults){
          res.json(user);
        });
      } else {
        res.status(400)
        .json({
          "error": "Email already in use"
        });
      }
    });
  }
  
});

router.post('/user/login', (req, res) => {
  var user = req.body;
  if (!user.email) {
    res.status(400);
    res.json({
      "error": "Bad Data"
    });
  } else {
    var cursor = db.collection('users').find({'email': user.email}).toArray(function(err, results){
      var len = results.length;
      if (len == 0) {
        res.status(400)
        .json({
          "error": "Email does not exist."
        });
      } else {
        res.json(results);
      }
    });
  }
  
});

module.exports = router;