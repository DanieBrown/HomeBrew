///** Everything Below Here is for Reading Temperature Sensors */
var ds18b20 = require('ds18b20'); // npm install --save ds18b20
var b = require('bonescript');
var fs = require('fs');
var led = "P8_13";
var tempTarget = 75;
b.pinMode(led, 'out');
var state = 0;
var inId = '28-00000521bec2';
var outId = '28-000005218965';
var sensorId = [];
ds18b20.sensors(function (err, id) {
   sensorId = id;
   //console.log(id)
});

var interval = 5000;
var valC = 0;
var valF = 0;

b.digitalWrite(led, 0);

setInterval(function () {
   sensorId.forEach(function (id) {
      ds18b20.temperature(id, function (err, val) {
         //send temperature reading out to console
         valC = val;
         //      while (valC == false) {
         //        ds18b20.temperature(id, function (err, valTemp) {
         //          valC = valTemp;
         //        });
         //      }
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
         //      if(id == inId && valF < tempTarget || id == inId && valF > tempTarget) {
         //        fs.writeFile('log.txt', 'Temp: ' + valF + ' Time: ' + Date.now, 'utf8');
         //      }
         b.digitalWrite(led, state);
         console.log('id: ', id, ' value in C: ', valC, ' value in F: ', valF);
         
         // Log to temporary json array.
         var sensor_data_array = [];
         sample_data_array.push({
           "Time" : new Date(),
           "Temp" : valF,
           "Heating" : state
	     });
         
         // Add to json file of temp readings.
         var file = './sensor_data.json';
         jsonfile.writeFile(file, sample_data, function (err) {
            if (err)
               console.error(err);
         });

      });
   });
}, interval);

b.digitalWrite(led, 0);

var express = require("express"); // npm install --save express
var app = express();
var fs = require("fs");
var util = require('util');
var jsonfile = require('jsonfile'); // npm install --save jsonfile
var bodyParser = require('body-parser'); // npm install --save body-parser
// var favicon = require('serve-favicon');
app.use(bodyParser.json()); // to de-serialize?
// app.use(favicon(__dirname + '/img/fav-beer.ico'));

/* Generate sample data to fill graph upon opening the page */
// Functionality for time stamps and dummy temps in a json text file
// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!


var state = 0;


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

// Add a sample data point to the sample data JSON object.

//setInterval(function() {
//	var sample_temp = getRandomInt(30, 100);
//	var sample_time = new Date();
//	sample_data.push({
//		"Time" : sample_time,
//		"Temp" : sample_temp,
//		"Heating" : state
//	});
//	console.log("Generated: " + "[Time: " + sample_time + " , Temp: "
//			+ sample_temp + "], State = " + state);
//	var file = './sensor_data.json';
//	jsonfile.writeFile(file, sample_data, function(err) {
//		if (err)
//			console.error(err);
//	});
//}, 3000);

// write the file
var file = './current_brew.json';
jsonfile.writeFile(file, sample_data, function (err) {
   if (err)
      console.error(err);
});

/* Server GET request */
app.get('/getCurrentSchedule', function (req, res) {
   jsonfile.readFile('./current_brew.json', function (err, jsonfile) {
      // res.json(jsonfile);
      res.json(sample_data);
   });
});

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

process.stdin.resume();//so the program will not close instantly


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
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));