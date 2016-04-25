// Server imports
var express = require("express"); // npm install --save express
var app = express();
var fs = require("fs");
var util = require('util');
var jsonfile = require('jsonfile'); // npm install --save jsonfile
var bodyParser = require('body-parser'); // npm install --save body-parser
app.use(bodyParser.json()); // to de-serialize?

// Sensor imports
var ds18b20 = require('ds18b20'); // npm install --save ds18b20
var b = require('bonescript');
var led = "P8_13";
var blueLed = "P8_12";
b.pinMode(led, 'out');
b.pinMode(blueLed, 'out');

// Global variables for sensing
var redState = 0;
var blueState = 0;
var inId = '28-00000521bec2';
var outId = '28-000005218965';
var sensorId = [];
var pos = 0; // for keeping track of current point in schedule
var empty_array = [];

// Generate sample data for currently scheduled brew
// add minutes: var newDateObj = new Date(oldDateObj.getTime() + diff*60000);
function generateSampleData(points, start_date) {
   var sample_data = [];

   sample_data.push({
      "Time": start_date,
      "Temp": 70
   });

   for (var i = 0; i < points; i++) {
      var temp = getRandomInt(73, 81);
      var time = new Date(start_date.getTime() + getRandomInt(1, 3) * 10000);
      start_date = time;
      sample_data.push({
         "Time": time,
         "Temp": temp
      });
      console.log("Generated sample point: " + sample_data[i].Time + "\n");
   }
   return sample_data;
}

function getRandomInt(min, max) {
   return Math.floor(Math.random() * (max - min)) + min;
}

// Assume first temp in cur schedule is not before the cur time.
var pos = 0;
var cur_brew_json = [];
var next_brew_json = [];
var isnextbrew = false;
var cur_time, cur_temp, next_time, next_temp, cur_end_pos;

function init() {
   var cur_generated_data = generateSampleData(2, new Date());

   // Populate current_brew with sample data.
   jsonfile.writeFile('./current_brew.json', cur_generated_data, function (err) {
      if (err) console.error("error writing to current brew: " + err);
   });

   var len_cur = cur_generated_data.length;
   var next_start_date = cur_generated_data[len_cur - 1].Time;
   var next_generated_data = generateSampleData(1, next_start_date);

   // Populate current_brew with sample data.
   jsonfile.writeFile('./next_brew.json', next_generated_data, function (err) {
      if (err) console.error("error writing to next brew: " + err);
      isnextbrew = true;
   });
}
init();

// Read in the the current brew schedule to a json object.
function startCurrentBrew() {
   jsonfile.readFile('./current_brew.json', function (err, data) {
      if (err) console.log("error reading current brew: " + err);
      cur_brew_json = data;
      //      console.log("read json from cur: " + data);
      console.log("Current brew is now: ");
      console.log(cur_brew_json);

      pos = 0;
      cur_time = cur_brew_json[pos].Time;
      cur_temp = cur_brew_json[pos].Temp;
      next_time = cur_brew_json[pos + 1].Time;
      next_temp = cur_brew_json[pos + 1].Temp;

      cur_end_pos = cur_brew_json.length - 1;
   });
}
startCurrentBrew();

function startNextBrew() {
   console.log("Loading your next brew configuration...");
   jsonfile.readFile('./next_brew.json', function (err, data) {
      if (err) console.log("error reading next brew: " + err);
      else console.log("Reading next brew into cur_brew_json...");
      //      cur_brew_json = [];
      cur_brew_json = data;
      //      console.log("cur_brew_json in startNextBrew(): " + cur_brew_json);

      // Overwritecurrent brew file with next.
      jsonfile.writeFile('./current_brew.json', data, function (err) {
         if (err) console.error(err);
         else console.log("Reading next brew into cur file...");

         // Clear the next_brew file.
         jsonfile.writeFile('./next_brew.json', empty_array, function (err) {
            isnextbrew = false;
            if (err) console.error(err);
            else console.log("Clearing next_brew.json file...");

            // Start the next one...
            startCurrentBrew();
         });
      });
   });
}

// Assign values of next time and temp cur, then get next.
function getNext() {
   console.log("       pos: " + pos + " | next_pos: " + (pos + 1) + " | last_idx: " + cur_end_pos);
   // Terminate loop if you've reached end of schedule.
   if (pos === cur_end_pos) {
      if (isnextbrew) {
         startNextBrew();
      } else {
         // if there is nothing in current or next brew, stop reading.
         clearInterval(brewer);
         console.log("No more brews, shutting down sensors. Ctrl+C to exit.");
      }
   } else {
      pos = pos + 1;

      console.log("now at pos: " + pos + " | next_pos: " + (pos + 1) + " | last_idx: " + cur_end_pos);
      cur_time = cur_brew_json[pos].Time;
      cur_temp = cur_brew_json[pos].Temp;

      if (pos !== cur_end_pos) {
         next_time = cur_brew_json[pos + 1].Time;
         next_temp = cur_brew_json[pos + 1].Temp;
      }
   }
}
// set sensor IDs?
ds18b20.sensors(function (err, id) {
   sensorId = id;
});

var valC = 0;
var valF = 0;
var sensor_data_array = [];

// Clear sensor data file.
jsonfile.writeFile('./sensor_data.json', empty_array, function (err) {
   if (err) console.error(err);
});

b.digitalWrite(led, 0);
b.digitalWrite(blueLed, 0);

// ONLY USE TEMP_TARGET FOR TESTING
//var tempTarget = 75;
// DELETE TEMP_TARGET WHEN DONE TESTING
var brewer = setInterval(function () {
   sensorId.forEach(function (id) {
      ds18b20.temperature(id, function (err, val) {
         valC = val;

         console.log('id: ', id, ' value in C: ', valC, ' value in F: ', valF);
         var time = new Date();
         // log to json file
         if (valF != false) {
            if (id === "28-000005218965") {
               sensor_data_array.push({
                  "Sensor": 'room',
                  "Time": time,
                  "Temp": valF,
                  "Heating": redState,
                  "Cooling": blueState
               });
            } else {
               sensor_data_array.push({
                  "Sensor": 'water',
                  "Time": time,
                  "Temp": valF,
                  "Heating": redState,
                  "Cooling": blueState
               });
            }
         }
         // After pushing to the sensor_data_array, re-write to the json file.
         logSensorData();

         // Change target time and temperature if it's time.
         var now = new Date().toISOString();

         // SUBTRACT 3 hours from next time when comparing to current time!
         // var next_change = new Date(next_time - 1*60*60*1000);
         // if (next_change <= now) {
         if (next_time <= now) {
            getNext();
         }

         // Get Farenheit
         if (valC != false) {
            valF = Math.round((valC * 1.8) + 32, -2);
         } else {
            valF = false;
         }

         var id = inId;

         // If water temp < target temp, heat
         if (id == inId && valF < cur_temp) {
            redState = 1;
         } else if (id == inId && valF != false) {
            redState = 0;
         }

         // If water temp > target temp, cool
         if (id == inId && valF > cur_temp) {
            blueState = 1;
         } else if (id == inId && valF != false) {
            blueState = 0;
         }

         b.digitalWrite(led, redState);
         b.digitalWrite(blueLed, blueState);
      });
   });
}, 2000);

function logSensorData() {
   jsonfile.writeFile('./sensor_data.json', sensor_data_array, function (err) {
      if (err)
         console.error(err);
   });
}

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
      if (err) console.error(err);
      isnextbrew = true;
   });
});

/* serves main page */
app.get("/", function (req, res) {
   res.sendFile('index.html');
});

/* serves all the static files */
app.get(/^(.+)$/, function (req, res) {
   console.log('static file request : ' + req.params);
   res.sendFile(__dirname + req.params[0]);
});

var port = process.env.PORT || 5000;
app.listen(port, function () {
   console.log("Listening on " + port);
});

process.stdin.resume(); //so the program will not close instantly

/* Turn off the Heater GPIO when the app closes! */
function exitHandler(options, err) {
   if (options.cleanup) console.log('clean');
   if (err) console.log(err.stack);
   if (options.exit) process.exit();

   b.digitalWrite(led, 0);
   b.digitalWrite(blueLed, 0);

//   // Clear the next_brew file.
//   jsonfile.writeFile('./next_brew.json', empty_array, function (err) {
//      isnextbrew = false;
//      if (err) console.error(err);
//      else console.log("Clearing next_brew.json file...");
//   });
//   
//   // Clear the current_brew file.
//   jsonfile.writeFile('./current_brew.json', empty_array, function (err) {
//      isnextbrew = false;
//      if (err) console.error(err);
//      else console.log("Clearing current_brew.json file...");
//   });
//   
//   // Clear the sensor_data file.
//   jsonfile.writeFile('./sensor_data.json', empty_array, function (err) {
//      isnextbrew = false;
//      if (err) console.error(err);
//      else console.log("Clearing sensor_data.json file...");
//   });


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