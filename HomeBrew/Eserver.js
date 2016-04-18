var express = require('express');
var app = express();


app.use(express.static('public'));


app.get('/Temp.html', function (req, res) {
   res.sendFile( __dirname + "/" + "Temp.html" );
})


/**
 * For your http GET request.
 */
app.get('/getTemp', function (req, res) {
	temp1 = {temp: 77, time: 5};
    temp2 = {temp: 99, time: 69};
    temp3 = {temp: 69,time: 5};
    var tempList = [temp1,temp2,temp3];
    console.log(tempList);
    res.json(tempList);
})

/**
 * The server.
 */
var server = app.listen(8080, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
})