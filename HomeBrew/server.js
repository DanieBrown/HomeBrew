var http = require('http');
var fs = require('fs');
var url = require('url');


// Create a server
http.createServer( function (request, response) {  
   // Parse the request containing file name
   var pathname = url.parse(request.url).pathname;
   
   // Print the name of the file for which request is made.
   console.log("Request for " + pathname + " received.");
   
   // Read the requested file content from file system
   fs.readFile(pathname.substr(1), function (err, data) {
      if (err) {
         console.log(err);
         // HTTP Status: 404 : NOT FOUND
         // Content Type: text/plain
         response.writeHead(404, {'Content-Type': 'text/html'});
      }else{	
         //Page found	  
         // HTTP Status: 200 : OK 
    	 // Retrieve
    	  
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
         response.writeHead(200, {'Content-Type': 'text/html'});	
         
         // Write the content of the file to response body
         response.write(data.toString());		
      }
      // Send the response body 
      response.end();
   });   
}).listen(8081);

// Console will print the message
console.log('Server running at http://127.0.0.1:8081/');