var express = require("express");
var app = express();
var fs = require("fs");
var util = require('util');
var jsonfile = require('jsonfile');

// Functionality for time stamps and dummy temps in a json text file
// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
   return Math.floor(Math.random() * (max - min)) + min;
}

var records = [];
//for( var i = 0; i<10; i++){
//	var number = getRandomInt(30, 100);
//	var today = new Date();
//	records.push({
//		"Temp": number,
//		"Time": today
//	});
//}

//write the file
var file = './file.json';
jsonfile.writeFile(file, records, function (err) {
   if (err)
      console.error(err);
});

/* Server GET request */
app.get('/getTemp', function (req, res) {
   jsonfile.readFile('./file.json', function (err, jsonfile) {
      console.log("jsonfile\n" + jsonfile);
      for (i = 0; i < jsonfile.length; i++) {
         records.push([jsonfile[i].Time, jsonfile[i].Temp]);
      }
      console.log("records\n" + records);
      res.json(records);
   });
});

app.get('/getTime', function (req, res) {
   jsonfile.readFile('./file.json', function (err, obj) {

      var fuck = [];
      for (i = 0; i < obj.Temps.length; i++) {
         fuck.push(obj.Temps[i].Time);
      }
      res.json(fuck);
   });
});

/* serves main page */
app.get("/", function (req, res) {
   res.sendfile('index.html');
});

app.post("/user/add", function (req, res) {
   /* some server side logic */
   res.send("OK");
});

/* serves all the static files */
app.get(/^(.+)$/, function (req, res) {
   console.log('static file request : ' + req.params);
   res.sendfile(__dirname + req.params[0]);
});

var port = process.env.PORT || 5000;
app.listen(port, function () {
   console.log("Listening on " + port);
});