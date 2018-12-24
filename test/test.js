// test.js
"use strict";

const server = require("../src/server.js");
const app = require("cpuabuse-app");
const path = require("path");
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

// Use chai extension
chai.use(chaiHttp);

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
	myServer.startServer();
});


var bakeryServerSettings = {
	host: "127.0.0.1",
	port: 81
};
var bakery;
new Promise(function(resolve){
	bakery = new app.App("bakery", path.resolve(__dirname, "bakery"), () => resolve());
}).then(function(){
	var myServer = new server.Server(bakeryServerSettings);
	myServer.addApp(bakery);
	myServer.startServer();
});

describe("test", function(){
	it("should be right", function(){
		assert.equal(5,5);
	})
});