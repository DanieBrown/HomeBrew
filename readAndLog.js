var ds18b20 = require('ds18b20');
var b = require('bonescript');
var fs = require('fs');
var led = "P8_13";
var state = 0;
var tempTarget = 75;
b.pinMode(led, 'out');
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
      while (valC = false) {
        ds18b20.temperature(id, function (err, valTemp) {
          valC = valTemp;
        });
      }
      if(valC != false) {
        valF = Math.round((valC * 1.8) + 32, -2);
      } else {
        valF = false;
      }
      if(id == inId && valF < tempTarget) {
        state=1;
      } else if (id == inId && valF != false ) {
        state=0;
      }
      if(id == inId && valF < tempTarget || id == inId && valF > tempTarget) {
        fs.writeFile('log.txt', 'Temp: ' + valF + ' Time: ' + Date.now, 'utf8', callback);
      }
      b.digitalWrite(led, state);
      console.log('id: ',id,' value in C: ',valC,' value in F: ',valF);
    });
  });
}, interval);

b.digitalWrite(led, 0);
