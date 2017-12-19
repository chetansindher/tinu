var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config');
var validUrl = require('valid-url');
var Url = require('./models/url');

//short id implementation
//var shortid = require('shortid');
//shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

mongoose.connect('mongodb://' + config.db.host + ":" + config.db.port + '/' + config.db.name);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.post('/tinu', function (req, res) {
  var longUrl = req.body.url;
  var shortUrl = '';
  if (validUrl.isUri(longUrl)) {

    Url.findOne({ tinu: longUrl }, function (err, doc) {
      if (doc) {
        shortUrl = config.webhost + doc._id.toString();
        res.send({ 'tinu': shortUrl });
      } else {
        //create a new url
        var newUrl = Url({
          tinu: longUrl
        });

        // save the new url
        newUrl.save(function (err, url) {
          if (err) {
            console.log(err);
          }
          shortUrl = config.webhost + url._id.toString();
          res.send({ 'tinu': shortUrl });
        });
      }
    });
  }
  else {
    res.send("Url is not valid");
  }
});

app.get('/:short', function (req, res) {
  var id = req.params.short;
  // check if url already exists in database
  Url.findOne({ _id: id }, function (err, doc) {
    if (doc) {
      res.redirect(doc.tinu);
    } else {
      res.redirect(config.webhost);
    }
  });
});


//app.get('/tinu/:url(*)', function (req, res, next) {

//  MongoClient.connect(mongoConnection, function (err, db) {
//    if (err) {
//      console.log("connection error", err);
//    }
//    else {
//      console.log("Connected to server")

//      var collection = db.collection('links');
//      var params = req.params.url;

//      //sets current hostname to var local
//      var local = req.get('host') + "/";

//      var newLink = function (db, callback) {
//        collection.findOne({ "url": params }, { short: 1, _id: 0 }, function (err, doc) {
//          if (doc != null) {
//            res.json({ original_url: params, short_url: local + doc.short });
//          }
//          else {
//            if (validUrl.isUri(params)) {
//              // if URL is valid, do this
//              var shortCode = shortid.generate();
//              var newUrl = { url: params, short: shortCode };
//              collection.insert([newUrl]);
//              res.json({ original_url: params, short_url: local + shortCode });
//            }
//            else {
//              // if URL is invalid, do this
//              res.json({ error: "Wrong url format, make sure you have a valid protocol and real site." });
//            };
//          };
//        });
//      };

//      newLink(db, function () {
//        db.close();
//      });

//    };
//  });
//});

//app.get('/:short', function (req, res, next) {
//  MongoClient.connect(mongoConnection, function (err, db) {
//    if (err) {
//      console.log("Unable to connect to server", err);
//    } else {
//      console.log("Connected to server")

//      var collection = db.collection('links');
//      var params = req.params.short;

//      var findLink = function (db, callback) {
//        collection.findOne({ "short": params }, { url: 1, _id: 0 }, function (err, doc) {
//          if (doc != null) {
//            res.redirect(doc.url);
//          } else {
//            res.json({ error: "No corresponding shortlink found in the database." });
//          };
//        });
//      };

//      findLink(db, function () {
//        db.close();
//      });

//    };
//  });
//});

var server = app.listen(3000, function () {
  console.log('Server listening on port 3000');
});
