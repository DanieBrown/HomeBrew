/**
 * http://usejsdoc.org/
 */
//Lets get started with the database
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;



var insertDocument = function(db, callback) {
	   db.collection('DummyTemps').insertOne( {
	      "DummyTemp" : 77
	   }, function(err, result) {
	    assert.equal(err, null);
	    console.log("Inserted a document into the restaurants collection.");
	    callback();
	  });
};
