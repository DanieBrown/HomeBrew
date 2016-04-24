var fs = require('fs');
var jsonfile = require('jsonfile'); // npm install --save jsonfile

var state = 0;

function getRandomInt(min, max) {
   return Math.floor(Math.random() * (max - min)) + min;
}

var sensor_data_array = [];
for (var i = 0; i < 10; i++) {
   var temp = getRandomInt(30, 100);
   state = getRandomInt(0,1);
   var today = new Date();
   sensor_data_array.push({
      "28-000005218965": {
         "Time": today,
         "Temp": temp,
         "Heating": state
      }
   });
   console.log("Pushing {28-000005218965: {Time: "+today+", Temp: "+temp+", Heating: "+state+"}}");
   logSensorData();
}
console.log(sensor_data_array);

function logSensorData() {
   jsonfile.writeFile('./sensor_data.json', sensor_data_array, function (err) {
      if (err)
         console.error(err);
   });
}