const express = require('express');
const router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const mongo = require('mongodb');

var url = 'mongodb://127.0.0.1:27017/patent_backend';


//connect to DB
MongoClient.connect(url, (err, database) => {
  
  if (err) return console.log(err);
  console.log("Connected successfully to server");
  db = database;
})



function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function convertPatentsToUserProfile(user, patentList) {
  //console.log(patentList);
  for (var i = 0; i < patentList.length; i++) {
    var patent = patentList[i];
    var assessment = { "user": user._id, "patent": patent._id, "name": patent.name, "ipc": patent.ipc, "method": patent.method, "domains": patent.domains, "topic": patent.topic };
    var termCandidates = [];
    var selectionCount = 0;
    //init term candidates
    for (var tc = 0; tc < patent.term_candidates.length; tc++) {
      var term_candidate = patent.term_candidates[tc];
      //init related terms
      var relatedTerms = [];
      if (term_candidate.related_terms) {
        for (var rt = 0; rt < term_candidate.related_terms.length; rt++) {
          var related_term = term_candidate.related_terms[rt];
          relatedTerms.push({"id": related_term.id, "relationship": -1});
          selectionCount++;
        }
      }
      
      termCandidates.push({"id": term_candidate.id, "search_quality": -1, "related_terms": relatedTerms});
      selectionCount++;
    }
    assessment.term_candidates = termCandidates;
    assessment.max_selections = selectionCount;
    assessment.current_selections = 0;
    //insert into DB
    //console.log(assessment);
    db.collection('assessments').insertOne(assessment, function(err, insertResults){
      //console.log(err);
    });
  }
}

function createUserProfile(user) {
  
  //search patents based on selected domains
  if (user.primaryDomain === "all") {
    var cursor = db.collection('patents').find({}).toArray(function(err, results){
      convertPatentsToUserProfile(user, results);
    });
  } else {
    var query = {$or:[
      {domains:user.primaryDomain},
      {domains:user.secondaryDomain},
      {domains:user.tertiaryDomain}
    ]}
    var cursor = db.collection('patents').find(query).toArray(function(err, results){
      convertPatentsToUserProfile(user, results);
    });
  }
  
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

router.get('/domains', (req, res) => {
  var cursor = db.collection('domains').find({}, {'sort':[['name','asc']]}).toArray(function(err, results){
    res.json(results);
  });
});

router.get('/pdfs/:id', (req, res) => {
  //EP-1237134-A2
  var ucid = req.params.id
  var cursor = db.collection('pdfs').find({'ucid':ucid}).toArray(function(err, results){
    var len = results.length;
    if (len == 0) {
      res.status(404)
      .json({
        "error": "Email does not exist."
      });
    } else {
      var data = results[0]['data'].buffer;
      //console.log(results[0]);
      res.contentType("application/pdf");
      res.send(data);
    }
  });
});

router.get('/assessments/user/:id', (req, res) => {
  o_id = new mongo.ObjectID(req.params.id);
  var cursor = db.collection('assessments').find({'user': o_id}, {'sort':[['name','asc'], ['topic','asc'], ['method','asc']]}).toArray(function(err, results){
    res.json(results);
  });
});

router.post('/assessments/', (req, res) => {
  var ids = req.body;
  user_id = new mongo.ObjectID(ids.user);
  patent_id = new mongo.ObjectID(ids.patent);
  var cursor = db.collection('assessments').find({'user': user_id, 'patent': patent_id}).toArray(function(err, results){
    res.json(results);
  });
});

router.put('/assessments/', (req, res) => {
  var assessment = req.body;
  //console.log(assessment);
  var assessment_id = new mongo.ObjectID(assessment._id);
  assessment.user = new mongo.ObjectID(assessment.user);
  assessment.patent = new mongo.ObjectID(assessment.patent);
  delete assessment._id;
  //console.log(assessment_id);
  var cursor = db.collection('assessments').findOneAndUpdate({'_id': assessment_id}, assessment, null, function(err, results){
    //console.log(results);
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
  user.password = 'assessment';
  if (!user.email || !user.primaryDomain || !user.secondaryDomain || !user.tertiaryDomain) {
    res.status(400);
    res.json({
      "error": "Bad Data"
    });
  } else {
    var cursor = db.collection('users').find({'email': user.email}).toArray(function(err, results){
      var len = results.length;
      if (len == 0) {
        db.collection('users').insertOne(user, function(err, insertResults){
          createUserProfile(insertResults.ops[0]);
          var retUser = insertResults.ops[0];
          delete retUser.password;
          res.json(retUser);
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
        var retUser = results[0];
        if (retUser.password === user.password) {
          delete retUser.password;
          res.json(retUser);
        } else {
          res.status(400).json({
            "error": "Email does not exist."
          });
        }
      }
    });
  }
  
});

module.exports = router;