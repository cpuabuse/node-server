// test.js
"use strict";

const server = require("../src/server.js");
const app = require("cpuabuse-app");
const path = require("path");

// Start server - will stay inside, executing
var serverSettings = {
	host: "127.0.0.1",
	port: 8080
};
var latin_classes;

new Promise(function(resolve){
	latin_classes = new app.App("cards", path.resolve(__dirname, "cards"), () => resolve());
}).then(function(){
	var myServer = new server.Server(serverSettings);
	myServer.addApp(latin_classes);
	console.log(myServer);
	myServer.startServer();
});