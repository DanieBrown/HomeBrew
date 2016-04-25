var express = require("express"); // npm install --save express
var app = express();
var fs = require("fs");
var util = require('util');
var jsonfile = require('jsonfile'); // npm install --save jsonfile
var bodyParser = require('body-parser'); // npm install --save body-parser
app.use(bodyParser.json()); // to de-serialize?

var state = 0;

// Create sample data for currently scheduled brew
// add minutes: var newDateObj = new Date(oldDateObj.getTime() + diff*60000);
var sample_data = [];
var last_time = new Date();

sample_data.push({
   "Time": last_time,
   "Temp": 70
});

for (var i = 0; i < 10; i++) {
   var temp = getRandomInt(30, 100);
   var time = new Date(last_time.getTime() + getRandomInt(1, 3) * 60000);
   //   console.log("     time: "+time);
   var last_time = time;
   //   console.log("last_time: "+last_time);
   sample_data.push({
      "Time": time,
      "Temp": temp
   });
   console.log("filled sample data array for current brew");
}

// Populate current_brew with sample data.
// Change to real data later (get from next_schedule when it comes up!)
jsonfile.writeFile('./current_brew.json', sample_data, function (err) {
   if (err) console.error("error writing to current brew: " + err);
});

// Assume first temp in cur schedule is not before the cur time.
var pos = 0;
var cur_brew_json, cur_time, cur_temp, next_time, next_temp, cur_brew_end, next_brew_start;

// Read in the the current brew schedule to a json object.
jsonfile.readFile('./current_brew.json', function (err, data) {
   if (err) console.log("error reading current brew: " + err);
   JSON.stringify(data);
   cur_brew_json = data;

   cur_time = cur_brew_json[pos].Time;
   cur_temp = cur_brew_json[pos].Temp;
   next_time = cur_brew_json[pos + 1].Time;
   next_temp = cur_brew_json[pos + 1].Temp;
   console.log("cur_time: " + cur_time);
   console.log("cur_temp: " + cur_temp);
   console.log("next_time: " + next_time);
   console.log("next_temp: " + next_temp);
});

// Assign values of next time and temp cur, then get next.
function getNext() {
   pos++;
   cur_time = cur_brew_json[pos].Time;
   cur_temp = cur_brew_json[pos].Temp;
   next_time = cur_brew_json[pos + 1].Time;
   next_temp = cur_brew_json[pos + 1].Temp;
}

function getRandomInt(min, max) {
   return Math.floor(Math.random() * (max - min)) + min;
}

var sensor_data_array = [];

function logSensorData() {
   jsonfile.writeFile('./sensor_data.json', sensor_data_array, function (err) {
      if (err) console.error(err);
   });
}

// add another point every 3 seconds
setInterval(function () {
   var now = new Date();
   if (next_time < now) {
      getNext();
      console.log("Moving to next temp target: " + cur_temp);
   }

   var in_temp = getRandomInt(30, 100);
   var out_temp = getRandomInt(30, 100);
   var tmp_heat_state = getRandomInt(0, 2);
   var tmp_cool_state = 0;
   if (tmp_heat_state === 0)
      tmp_cool_state = getRandomInt(0, 2);
   var today = new Date();
   sensor_data_array.push({
      "Sensor": 'room',
      "Time": today,
      "Temp": out_temp,
      "Heating": tmp_heat_state,
      "Cooling": tmp_cool_state
   });
   sensor_data_array.push({
      "Sensor": 'water',
      "Time": today,
      "Temp": in_temp,
      "Heating": tmp_heat_state,
      "Cooling": tmp_cool_state
   });
   logSensorData();
   console.log("logged 2 random temp senses.");
}, 1000);

// Get JSON object of sensor data
app.get('/getSensorData', function (req, res) {
   console.log("getting sensor data from test server...");
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