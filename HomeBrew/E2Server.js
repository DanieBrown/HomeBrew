/**
 * http://usejsdoc.org/
 */
var express = require("express");
var app = express();
var mongojs = require('mongojs');
var db = mongojs('DummyTemps', ['DummyTemps']);



/**
 * For your http GET request.
 */
app.get('/getTemp', function (req, res) {
	//temp1 = {temp: 77, time: 5};
    //temp2 = {temp: 99, time: 69};
    //temp3 = {temp: 69,time: 5};
    //var tempList = [temp1,temp2,temp3];
    //console.log(tempList);
    //res.json(tempList);
	db.DummyTemps.find(function(err, docs){
		console.log(docs);
		res.json(docs);
	});
	
});

/* serves main page */
app.get("/", function(req, res) {
res.sendfile('index.htm')
});

app.post("/user/add", function(req, res) { 
/* some server side logic */
res.send("OK");
});

/* serves all the static files */
app.get(/^(.+)$/, function(req, res){
console.log('static file request : ' + req.params);
res.sendfile( __dirname + req.params[0]); 
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
console.log("Listening on " + port);
});