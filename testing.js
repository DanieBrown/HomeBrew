var express = require("express"); // npm install --save express
var app = express();
var fs = require("fs");
var util = require('util');
var jsonfile = require('jsonfile'); // npm install --save jsonfile
var bodyParser = require('body-parser'); // npm install --save body-parser
app.use(bodyParser.json()); // to de-serialize?

var state = 0;

function getRandomInt(min, max) {
   return Math.floor(Math.random() * (max - min)) + min;
}

var sensor_data_array = [];
for (var i = 0; i < 10; i++) {
   var temp = getRandomInt(30, 100);
   state = getRandomInt(0, 1);
   var today = new Date();
   sensor_data_array.push({
      "Water": {
         "Time": today,
         "Temp": temp,
         "Heating": state
      }
   });
   //   console.log("Pushing {Water: {Time: " + today + ", Temp: " + temp + ", Heating: " + state + "}}");
   sensor_data_array.push({
      "Room": {
         "Time": today,
         "Temp": temp,
         "Heating": state
      }
   });
   //   console.log("Pushing {Room: {Time: " + today + ", Temp: " + temp + ", Heating: " + state + "}}");
   logSensorData();
}
//console.log(sensor_data_array);

function logSensorData() {
   jsonfile.writeFile('./sensor_data.json', sensor_data_array, function (err) {
      if (err) console.error(err);
   });
}

var sample_data = [];
for (var i = 0; i < 10; i++) {
   var temp = getRandomInt(30, 100);
   var time = new Date();
   sample_data.push({
      "Time": time,
      "Temp": temp
   });
   //   console.log("filled sample data array for current brew");
}

// add another point every 3 seconds
setInterval(function () {
   var temp = getRandomInt(30, 100);
   var time = new Date();
   sample_data.push({
      "Time": time,
      "Temp": temp
   });
   jsonfile.writeFile('./current_brew.json', sample_data, function (err) {
      if (err) console.error(err);
   });
   console.log("added new sample point.");
}, 3000);

// Populate current_brew with sample data.
// Change to real data later (get from next_schedule when it comes up!)
jsonfile.writeFile('./current_brew.json', sample_data, function (err) {
   if (err) console.error(err);
});

// Get JSON object of sensor data
app.get('/getSensorData', function (req, res) {
   jsonfile.readFile('./sensor_data.json', function (err, jsonfile) {
      res.json(jsonfile);
   });
});

// Get JSON object of the current schedule (non changing)
app.get('/getCurrentSchedule', function (req, res) {
   console.log("getting current schedule from test server...");
   jsonfile.readFile('./current_brew.json', function (err, jsonfile) {
      res.json(jsonfile);
   });
});

// Write data from create.html to JSON file for the next schedule
app.post('/postNewSchedule', function (req, res) {
   console.log("Called post method in controller.");
   console.log(req.body);
   jsonfile.writeFile('./next_brew.json', req.body, function (err) {
      if (err) console.error(err);
   });
});

/* serves main page */
app.get("/", function (req, res) {
   res.sendfile('index.html');
});

/* serves all the static files */
app.get(/^(.+)$/, function (req, res) {
   console.log('static file request : ' + req.params);
   res.sendfile(__dirname + req.params[0]);
});

var port = process.env.PORT || 5000;
app.listen(port, function () {
   console.log("Listening on " + port);
   // console.log("full path is: " + (__dirname + '/img/favicon.ico'));
});