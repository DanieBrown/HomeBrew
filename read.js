var ds18b20 = require('ds18b20');
var b = require('bonescript');
var ledHot = "P8_13";
var ledCold = "P8_12";
var state = 0;
var tempTarget = 75;
b.pinMode(ledHot, 'out');
b.pinMode(ledCold, 'out');
var inId = '28-00000521bec2';
var outId = '28-000005218965';
var sensorId = [];
ds18b20.sensors(function (err, id) {
  sensorId = id;
  //console.log(id)
});

var interval = 5000;
var valF = 0;

b.digitalWrite(ledHot, 0);

setInterval(function () {
  sensorId.forEach(function (id) {
    ds18b20.temperature(id, function (err, valC) {
      //send temperature reading out to console
      if(valC != false) {
        valF = Math.round((valC * 1.8) + 32, -2);
      } else {
        valF = false;
      }
      if(id == inId && valF < tempTarget) {
        stateCold=1;
      } else if (id == inId && valF != false ) {
        stateCold=0;
      }
      if(id == inId && valF > tempTarget) {
        stateHot=1;
      } else if (id == inId && valF != false ) {
        stateHot=0;
      }
      b.digitalWrite(ledHot, stateHot);
      b.digitalWrite(ledCold, stateCold);
      console.log('id: ',id,' value in C: ',valC,' value in F: ',valF);
    });
  });
}, interval);

b.digitalWrite(ledHot, 0);
