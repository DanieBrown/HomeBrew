// how to reset you branch to the remote master when you screw everything up
//git fetch origin
//git reset --hard origin/master
///** Everything Below Here is for Reading Temperature Sensors */
var express = require("express"); // npm install --save express
var app = express();
var fs = require("fs");
var util = require('util');
var jsonfile = require('jsonfile'); // npm install --save jsonfile
var bodyParser = require('body-parser'); // npm install --save body-parser
// var favicon = require('serve-favicon');
app.use(bodyParser.json()); // to de-serialize?
// app.use(favicon(__dirname + '/img/fav-beer.ico'));

var ds18b20 = require('ds18b20'); // npm install --save ds18b20
var b = require('bonescript');
var led = "P8_13";
var blueLed = "P8_12";
var tempTarget = 75;
b.pinMode(led, 'out');
b.pinMode(blueLed, 'out');
var state = 0;
var blueState = 0;
var inId = '28-00000521bec2';
var outId = '28-000005218965';
var sensorId = [];

// set sensor IDs?
ds18b20.sensors(function (err, id) {
   sensorId = id;
   //console.log(id)
});

var interval = 5000;
var valC = 0;
var valF = 0;
var sensor_data_array = [];

b.digitalWrite(led, 0);
b.digitalWrite(blueLed, 0);

setInterval(function () {
   sensorId.forEach(function (id) {
      ds18b20.temperature(id, function (err, val) {
        //send temperature reading out to console
        valC = val;

        if (valC != false) {
          valF = Math.round((valC * 1.8) + 32, -2);
        } else {
           valF = false;
        }
        if (id == inId && valF < tempTarget) {
          state = 1;
        } else if (id == inId && valF != false) {
          state = 0;
        }
        if (id == inId && valF > tempTarget) {
          blueState = 1;
        } else if (id == inId && valF != false) {
          blueState = 0;
        }

         b.digitalWrite(led, state);
         b.digitalWrite(blueLed, blueState);
         console.log('id: ', id, ' value in C: ', valC, ' value in F: ', valF);
         var time = new Date();
         // log to json file
         if (id === "28-000005218965") {
            // Log to temporary json array.
            sensor_data_array.push({
               "Room": {
                  "Time": time,
                  "Temp": valF,
                  "Heating": state
               }
            });
         } else {
            sensor_data_array.push({
               "Water": {
                  "Time": time,
                  "Temp": valF,
                  "Heating": state
               }
            });
         }
         // After pushing to the sensor_data_array, re-write to the json file.
         logSensorData();
      });
   });
}, interval);


function logSensorData() {
   jsonfile.writeFile('./sensor_data.json', sensor_data_array, function (err) {
      if (err)
         console.error(err);
   });
}

b.digitalWrite(led, 0);


/* Generate sample data to fill graph upon opening the page */
// Functionality for time stamps and dummy temps in a json text file
// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!

function getRandomInt(min, max) {
   return Math.floor(Math.random() * (max - min)) + min;
}

var sample_data = [];
for (var i = 0; i < 10; i++) {
   var number = getRandomInt(30, 100);
   var today = new Date();
   sample_data.push({
      "Time": today,
      "Temp": number
   });
}

// write the file
var file = './current_brew.json';
jsonfile.writeFile(file, sample_data, function (err) {
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
   jsonfile.readFile('./current_brew.json', function (err, jsonfile) {
      res.json(jsonfile);
   });
});

// Write data from create.html to JSON file for the next schedule
app.post('/postNewSchedule', function (req, res) {
   console.log("Called post method in controller.");
   console.log(req.body);
   jsonfile.writeFile('./next_brew.json', req.body, function (err) {
      if (err)
         console.error(err);
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

process.stdin.resume(); //so the program will not close instantly


/* Turn off the Heater GPIO when the app closes! */
function exitHandler(options, err) {
   if (options.cleanup) console.log('clean');
   if (err) console.log(err.stack);
   if (options.exit) process.exit();
   if (state == 1) {
      b.digitalWrite(led, 0);
   }
}

//do something when app is closing
process.on('exit', exitHandler.bind(null, {
   cleanup: true
}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {
   exit: true
}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {
   exit: true
}));