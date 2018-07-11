/*
* Primary file for the API
*
*/

// Dependencies
var http = require('http');
var https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./lib/config');
var fs = require ('fs');
var handlers = require('./lib/handlers');
var helpers = require('./lib/helpers');

// Const
const hostname = '127.0.0.1';

// Instantiate the HTTP servder
var httpServer = http.createServer(function(req, res){
   unifiedServer(req,res);
});

// Start the HTTP server
httpServer.listen(config.httpPort, function(){
    console.log("HTTP server is listening on port "+config.httpPort);
});


// Instantiate the HTTPS servder
var httpsServerOptions = {
    'key' : fs.readFileSync('./https/key.pem'),
    'cert' : fs.readFileSync('./https/cert.pem')
};

var httpsServer = https.createServer(httpsServerOptions, function(req, res){
    unifiedServer(req,res);
 });
 
 // Start the HTTPS server
 httpsServer.listen(config.httpsPort, function(){
     console.log("HTTPS server is listening on port "+config.httpsPort);
 });
 


// Unified Start Server function
var unifiedServer = function(req, res){
 // Ge the URL and parse it
 var parsedUrl = url.parse(req.url, true);

 // Get the path
 var path = parsedUrl.pathname;
 var trimmedPath = path.replace(/^\/+|\/+$/g,'');

 // Get teh query string as an object
 var queryStringObject = parsedUrl.query;


 // Get the HTTP method
 var method = req.method.toLowerCase();

 // Get the headedrs as object
 var headersObject = req.headers;

 // Get the payload, if any
 var decoder = new StringDecoder('utf-8');
 var buffer = '';
 req.on('data', function(data){
     buffer += decoder.write(data);
 });
 req.on('end', function(){
     buffer += decoder.end();

     // Choose the handler this request should go to
     var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

     // Construct the data object to send to the handler
     var data = {
         'trimmedPath' : trimmedPath,
         'queryStringObject' : queryStringObject,
         'method' : method,
         'headers' : headersObject,
         'payload' : helpers.parseJsonToObject(buffer)
     };

     // Route the request to the handler specfied in the router
     chosenHandler(data, function(statusCode, payload){
         // Use the status code called back by the handler, or default to 200
         statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

         // Use the payload called back by the handler or default to an empty object
         payload = typeof(payload) == 'object' ? payload : {};
     
         // Convert object to string
         var payloadString = JSON.stringify(payload);

         // Return the response
         res.setHeader('Content-Type', 'application/json');
         res.writeHead(statusCode);
         res.end (payloadString);

             // Log the request payload
         console.log('Returning this response ',statusCode, payloadString);
     });
     /*
    // Send the response
    console.log('HTTP request received on: ');
    console.log('METHOD: ' +method );
    console.log('PATH: ' +trimmedPath);
    console.log('PARAMETERS: ', queryStringObject);
    console.log('HEADERS: ', headersObject);
    console.log('\n');
     */
 });
    
};


// Define a request router
var router = {
    'sample' : handlers.sample,
    'ping' : handlers.ping,
    'users' : handlers.users
};