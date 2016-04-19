var express = require("express");
var app = express();
var mongojs = require('mongojs');
var db = mongojs('DummyTemps', [ 'DummyTemps' ]);

/* Server GET request */
app.get('/getTemp', function(req, res) {
	db.DummyTemps.find(function(err, docs) {
       console.log(docs);
       res.json(docs);
	});
});

/* Server GET request */
app.get('/getName', function(req, res) {
	db.stats(function(err, docs) {
		var Name = docs.db;
		res.json(Name);
	});
});

app.get('/getTime', function(req, res) {
	db.collection('DummyTemps').find().toArray(function(err, items) {
		console.log(items);
//		res.json(items);
		console.log("len: "+items.length);
		var fuck = [];
		for (i = 0 ; i < items.length; i++) {
			fuck.push(items[i].Time);
		}
		console.log(fuck);
		res.json(fuck);
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
app.get(/^(.+)$/, function(req, res) {
	console.log('static file request : ' + req.params);
	res.sendfile(__dirname + req.params[0]);
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
	console.log("Listening on " + port);
});