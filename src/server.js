// server.js
"use strict";
const http = require("http");
const url = require("url");

class Server{
	// Constructor
	constructor(settings){
		// Init server structure
		this.apps = new Array(); // Create the app pool
		this.routes = new Object(); // Define app routes
		this.settings = settings; // Set settings
	}

	startServer (){
		// Create server
		this.server = http.createServer((request, response) => this.processRequest(request, response));

		// Start listening
		this.server.listen(this.settings);

		// Log the status to the console
		console.log('Server listening @ ' + this.settings.host + ':' + this.settings.port);

		// Event: 'clientError' - Gracefully close connection on client error; Client connection socket forwards it's error event here. The socket would be terminated if not handled.
		this.server.on('clientError', (err, socket) => {
			socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
		});
	}

	addApp(app){
		// Add an app to app array
		this.apps.push(app);

		this.reconstructRouteTable();
	}

	reconstructRouteTable(){
		this.apps.forEach(app => {
			for (var endpoint in app.endpoints){
				this.routes[endpoint] = app;
			}
		});
	}

	getApp(path){
		for (var route in this.routes){
			console.log(route);
			if(path.startsWith(route)){
				return {
					app: this.routes[route],
					resource: url.parse(path).pathname.slice(route.length + 1, path.length),
					query: url.parse(path, true).query
				};
			}
		}
		// FIXME: Make me an error
		throw 500;
	}

	processRequest(request, response){
		try{
			let appAndResource = this.getApp(request.url);
			let {app} = appAndResource;
			let {resource} = appAndResource;
			let {query} = appAndResource;
			response.setHeader("Content-type", resource == "css" ? "text/css" : resource == "script" ? "text/javascript" : resource == "backlit_blurred_background_close_up_plants" || resource == "trees_aurora" ? "image/jpeg" : "text/html; charset=utf-8");
			app.getResource(resource, query.value).then(data => resource == "backlit_blurred_background_close_up_plants" || resource == "trees_aurora" ? response.end(data, 'binary') : response.end(data));
		} catch (error){
			if (error){
				response.end("500: Internal server error");
			}
		}
	}
}

module.exports = {
	Server
};