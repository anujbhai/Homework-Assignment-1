/*
* Primary file
*/

// Dependencies
const http = require('http'),
	https = require('https'),
	url = require('url'),
	StringDecoder = require('string_decoder').StringDecoder,
	config = require('./config'),
	fs = require('fs');

// Instantiate the http server
var httpServer = http.createServer(function (req, res) {
	unifiedSrever(req, res);
});

// Start the http server
httpServer.listen(config.httpPort, function () {
	console.log('The server is listening on port ' + config.httpPort + ' now in ' + config.envName + ' mode!');
});

// Instantiate the https server
var createServerOptions = {
	'key': fs.readFileSync('./https/key.pem'),
	'cert': fs.readFileSync('./https/cert.pem')
}
var httpsServer = https.createServer(createServerOptions, function (req, res) {
	unifiedSrever(req, res);
});

// Start the https server
httpsServer.listen(config.httpsPort, function () {
	console.log('The server is listening on port ' + config.httpsPort + ' now in ' + config.envName + ' mode!');
});


// All the logic for both the http and https server
var unifiedSrever = function (req, res) {
	// Get the url and parse it
	var parsedUrl = url.parse(req.url, true);

	// Get the path
	var path = parsedUrl.pathname;
	var trimmedPath = path.replace(/^\/+|\/+$/g, '');

	// Get the query string as an object
	var queryStringObject = parsedUrl.query;

	// Get the http method
	var method = req.method.toLowerCase();

	// Get the header as an object
	var headers = req.headers;

	// Get the payloads if any
	var decoder = new StringDecoder('utf-8');
	var buffer = '';

	req.on('data', function (data) {
		buffer += decoder.write(data);
	});

	req.on('end', function () {
		buffer += decoder.end();

		// Choose the handler this request should go to. If it is not found use the notFound handler
		var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

		// Construct the data object to send to the handler
		var data = {
			'trimmedPath': trimmedPath,
			'queryStringObject': queryStringObject,
			'method': method,
			'headers': headers,
			'payload': buffer
		};

		// Route the request to the handler specified in the router
		chosenHandler(data, function (statusCode, payload) {
			// Use the status code called back by the handler or default to 200
			statusCode = typeof(statusCode) === 'number' ? statusCode : 200;

			// Use the payload called back by the handler or default to an empty object
			payload = typeof(payload) === 'object' ? payload : {};

			// Conver the payload to a string
			var payloadString = JSON.stringify(payload);

			// Return the response
			res.setHeader('Content-Type', 'application/json');
			res.writeHead(statusCode);
			// Send the response
			res.end(payloadString);

			// Log the request path
			console.log('Return this response: ', statusCode, payloadString);
		});
	});
};

// Define the handlers
var handlers = {};

// Hello handler
handlers.hello = function (data, callback) {
	// Callback a http status code and a payload object
	callback(406, {'message': 'Welcome User'})
};

// Not found handler
handlers.notFound = function (data, callback) {
	callback(404);
};

// Define a request router
var router = {
	'hello': handlers.hello
};