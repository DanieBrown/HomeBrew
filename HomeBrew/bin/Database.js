//Lets get started with the database
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/DummyTemps';
	
MongoClient.connect(url, function(err, db) {
	console.log("WE ARE CONNECTED!")
	
	// Returns a random integer between min (included) and max (excluded)
	// Using Math.round() will give you a non-uniform distribution!
	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min)) + min;
	}
	
	

	for( var i = 0; i<10; i++){
		var number = getRandomInt(30, 100);
		var today = new Date();
		console.log(today);
		var record = { Temp: number, Time: today };
		db.collection('DummyTemps').insert(record);
	}
	//db.collection('DummyTemps').remove();
});
