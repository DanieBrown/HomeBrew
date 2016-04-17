/**
 * http://usejsdoc.org/
 */
//Lets get started with the database
var MongoClient = require('mongodb').MongoClient;
// Connect to the db which should create a new database called Temps
MongoClient.connect("mongodb://localhost:27017/Temps", function(err, db) {
	if(err) { return console.dir(err); }
		console.log("We are connected to Mongo");
    	//Sweet we got here, now lets add some "temperatures" to this
    	    
    	    
    	//This will check to see if we have a collection to insert into
    	db.collection('DummyTemps', {strict:true}, function(err, collection) {});
    	db.createCollection('DummyTemps', function(err, collection) {});

    	var collection = db.collection('DummyTemps');
    	function randomIntInc (low, high) {
    		return Math.floor(Math.random() * (high - low + 1) + low);
        }
        for(var i = 0; i<10; i++){
        	var number = randomIntInc(30,100);
        	console.log("Random Number:", number);
        	//This insert will report an error if the value is not
        	//inserted correctly
        	collection.insert({i:number}, {w:1}, function(err, result) {});
        	//collection.remove();
        }
 });