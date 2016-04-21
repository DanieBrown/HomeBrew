var express = require("express");
var app = express();
var fs = require("fs");
var util = require('util');



//Functionality for time stamps and dummy temps in a json text file
// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}
var record = {
		Temps: []
};
for( var i = 0; i<10; i++){
	var number = getRandomInt(30, 100);
	var today = new Date();
	record.Temps.push({
		"Temp": number,
		"Time": today
	});
}

//writes ['https://twitter.com/#!/101Cookbooks', 'http://www.facebook.com/101cookbooks']
fs.writeFileSync('./file.json', util.inspect(record) , 'utf-8');

/* Server GET request */
app.get('/getTemp', function(req, res) {
	res.json(record);
});

app.get('/getTime', function(req, res) {
		console.log(record);
//		res.json(items);
		var fuck = [];
		for (i = 0 ; i < record.Temps.length; i++) {
			fuck.push(record.Temps[i].Time);
			console.log("push:["+i+"]: "+record.Temps[i].Time);
		}
		res.json(fuck);
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
app.get(/^(.+)$/, function(req, res) {
	console.log('static file request : ' + req.params);
	res.sendfile(__dirname + req.params[0]);
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
	console.log("Listening on " + port);
});