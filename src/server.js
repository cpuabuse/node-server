// server.js
"use strict";
const app = require("cpuabuse-app");
const http = require("http");
const path = require("path");

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
			if(path.startsWith(route)){
				return {
					app: this.routes[route],
					resource: path.slice(route.length + 1, path.length)
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
			console.log(resource);
			app.getResource(resource).then(data => response.end(data));
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