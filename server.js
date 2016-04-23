var express = require("express");
var app = express();
var fs = require("fs");
var util = require('util');
var jsonfile = require('jsonfile');
var bodyParser = require('body-parser');
app.use(bodyParser.json());

// Functionality for time stamps and dummy temps in a json text file
// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
   return Math.floor(Math.random() * (max - min)) + min;
}

var sample_brew = [];
for( var i = 0; i<10; i++){
var number = getRandomInt(30, 100);
	var today = new Date();
	sample_brew
       .push({
		"Temp": number,
		"Time": today
	});
}

//write the file
var file = './current_brew.json';
jsonfile.writeFile(file, sample_brew
                   , function (err) {
   if (err)
      console.error(err);
});

/* Server GET request */
app.get('/getCurrentSchedule', function (req, res) {
   jsonfile.readFile('./current_brew.
                    json', function (err, jsonfile) {
      res.json(jsonfile);
   });
});

app.post('/postNewSchedule', function (req, res) {
   console.log("Data posted from controller: " + req.body);
   jsonfile.writeFile('./next_brew.json', req.body, function (err) {
   if (err)
      console.error(err);
   });
});

app.get('/getTime', function (req, res) {
   jsonfile.readFile('./current_brew.
                    json', function (err, obj) {

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