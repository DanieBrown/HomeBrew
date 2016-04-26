// Server imports
var express = require("express"); // npm install --save express
var app = express();
var fs = require("fs");
var util = require('util');
var jsonfile = require('jsonfile'); // npm install --save jsonfile
var bodyParser = require('body-parser'); // npm install --save body-parser
app.use(bodyParser.json()); // to de-serialize?

// Sensor imports
//var ds18b20 = require('ds18b20'); // npm install --save ds18b20
//var b = require('bonescript');
//var led = "P8_13";
//var blueLed = "P8_12";
//b.pinMode(led, 'out');
//b.pinMode(blueLed, 'out');

// Global variables for sensing
var redState = 0;
var blueState = 0;
var inId = '28-00000521bec2';
//var outId = '28-000005218965';
//var sensorId = [];
var pos = 0; // for keeping track of current point in schedule
var empty_array = [];

// Generate sample data for currently scheduled brew
// add minutes: var newDateObj = new Date(oldDateObj.getTime() + diff*60000);
function generateSampleData(points, start_date) {
//   var last_time = new Date();
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
   var cur_generated_data = generateSampleData(7, new Date());

   // Populate current_brew with sample data.
   jsonfile.writeFile('./current_brew.json', cur_generated_data, function (err) {
      if (err) console.error("error writing to current brew: " + err);
   });

   var len_cur = cur_generated_data.length;
   var next_start_date = cur_generated_data[len_cur-1].Time;
//   var next_generated_data = generateSampleData(3, next_start_date);

//   // Populate next_brew file with sample data.
//   jsonfile.writeFile('./next_brew.json', next_generated_data, function (err) {
//      if (err) console.error("error writing to next brew: " + err);
//      isnextbrew = true;
//   });
}
init();

// Read in the the current brew schedule to a json object.
function startCurrentBrew() {
   jsonfile.readFile('./current_brew.json', function (err, data) {
      if (err) console.log("error reading current brew: " + err);
//      JSON.stringify(data);
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
   console.log("       pos: "+pos+" | next_pos: "+(pos+1)+" | last_idx: "+cur_end_pos);
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
      
      console.log("now at pos: "+pos+" | next_pos: "+(pos+1)+" | last_idx: "+cur_end_pos);
      cur_time = cur_brew_json[pos].Time;
      cur_temp = cur_brew_json[pos].Temp;
      
      if (pos !== cur_end_pos) {
         next_time = cur_brew_json[pos + 1].Time;
         next_temp = cur_brew_json[pos + 1].Temp;         
      }
//      console.log("next_time: "+next_time);
   }
}
// set sensor IDs?
//ds18b20.sensors(function (err, id) {
//   sensorId = id;
//});

//var valC = 0;
//var valF = 0;
var sensor_data_array = [];

// Clear sensor data file.
jsonfile.writeFile('./sensor_data.json', empty_array, function (err) {
   if (err) console.error(err);
});

//b.digitalWrite(led, 0);
//b.digitalWrite(blueLed, 0);

var rate = 1.39e-6;
var interval = 2;

// ONLY USE TEMP_TARGET FOR TESTING
//var tempTarget = 75;
// DELETE TEMP_TARGET WHEN DONE TESTING
var brewer = setInterval(function () {
//   sensorId.forEach(function (id) {
//      ds18b20.temperature(id, function (err, val) {
//         valC = val;
//
//         // console.log('id: ', id, ' value in C: ', valC, ' value in F: ', valF);
//         var time = new Date();
//         // log to json file
//         if (valF != false) {
//            if (id === "28-000005218965") {
//               sensor_data_array.push({
//                  "Sensor": 'room',
//                  "Time": time,
//                  "Temp": valF,
//                  "Heating": redState,
//                  "Cooling": blueState
//               });
//            } else {
//               sensor_data_array.push({
//                  "Sensor": 'water',
//                  "Time": time,
//                  "Temp": valF,
//                  "Heating": redState,
//                  "Cooling": blueState
//               });
//            }
//         }
//         // After pushing to the sensor_data_array, re-write to the json file.
//         logSensorData();

         var in_temp = getRandomInt(70, 85);
         var valC = in_temp;
         var valF;
         var out_temp = getRandomInt(75, 82);
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
//         console.log("logged 2 random temp senses.");

         // Change target time and temperature if it's time.
         var now = new Date().toISOString();
//         console.log("Time til next time: "+ (next_time - now));
         
   
         // SUBTRACT 3 hours from next time when comparing to current time!
         // var next_change = new Date(next_time - 1*60*60*1000);
         // if (next_change <= now) {
         if (next_time <= now) {
            getNext();
         }
//         else if (next_time === false) {
//             console.log("no next time, just get next brew...");
//            startNextBrew();
//         }

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
   
//         // Prediction: 
//         var temp_diff = next_temp - cur_temp;
//         var time_to_change = new Date(temp_diff/rate);
//         
//         if((time_to_change <= now ) && (next_temp > cur_temp)) {
//            console.log("Start heating now, next temp is : "+next_temp);
//            redState = 1;
//         } else if ((time_to_change <= now ) && (next_temp < cur_temp)) {
//            console.log("Start cooling now, next temp is : "+next_temp);
//            blueState = 1;
//         }

//         b.digitalWrite(led, redState);
//         b.digitalWrite(blueLed, blueState);
//      });
//   });
}, interval*1000);

function logSensorData() {
   jsonfile.writeFile('./sensor_data.json', sensor_data_array, function (err) {
      if (err)
         console.error(err);
   });
}

function isNextBrew() {
   jsonfile.readFile('./next_brew.json', function (err, jsonfile) {
      if (err) isnextbrew = false;
      else isnextbrew = true;

      if (jsonfile === []) isnextbrew = false;
      if (jsonfile === undefined) isnextbrew = false;
      if (jsonfile.length === 0) isnextbrew = false;
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

// Get JSON object of the current schedule (non changing)
app.get('/getNextSchedule', function (req, res) {
   jsonfile.readFile('./next_brew.json', function (err, jsonfile) {
      res.json(jsonfile);
   });
});

// Write data from create.html to JSON file for the next schedule
app.post('/postNewSchedule', function (req, res) {
   console.log("Called postNewSchedule method in server.");
   console.log(req.body);
   jsonfile.writeFile('./next_brew.json', req.body, function (err) {
      if (err) console.error(err);
      isnextbrew = true;
   });
});

// Set interval
app.post('/postNewInterval', function (req, res) {
   console.log("Setting new interval: "+req.body[0].Interval);
   interval = req.body[0].Interval;
   console.log("interval: "+ interval);
});

/* serves main page */
app.get("/", function (req, res) {
//   res.sendFile('index.html');
    res.sendFile(__dirname + '/index.html');
});

/* serves all the static files */
app.get(/^(.+)$/, function (req, res) {
   console.log('static file request : ' + req.params);
   res.sendFile(__dirname + req.params[0]);
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

   //   b.digitalWrite(led, 0);
   //   b.digitalWrite(blueLed, 0);
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

function logSensorData() {
   jsonfile.writeFile('./sensor_data.json', sensor_data_array, function (err) {
      if (err) console.error(err);
   });
}