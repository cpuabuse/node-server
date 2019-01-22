// test.js
"use strict";

// Set eslint to ingore describe and it for assert
/* global describe:true */
/* global it:true */
/* global before:true */
/* global after:true */

const server = require("../src/server.js");
const app = require("cpuabuse-app");
const path = require("path");
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

// Use chai extension
chai.use(chaiHttp);

describe("Server", function(){
	var servers = [
		{
			serverSettings: {
				host: "127.0.0.1",
				port: 81
			},
			apps: [
				{
					id: "bakery"
				}
			]
		}
	];
	var serverInstances = new Array();

	before(function(done){
		var serverPromises = new Array();

		servers.forEach(function(serverTest){
			serverPromises.push(new Promise(function(resolve){
				var appPromises = new Array();
				var serverInstance = new server.Server(serverTest.serverSettings);
				serverInstances.push(serverInstance);

				serverTest.apps.forEach(function(appTest){
					appPromises.push(new Promise(function(resolve){
						let bakery = new app.App("bakery", path.resolve(__dirname, "bakery"), "off", () => {
							serverInstance.addApp(bakery);
							resolve();
						});
					}));
				});

				Promise.all(appPromises).then(function(){
					serverInstance.startServer();
					resolve();
				});
			}));
		});

		Promise.all(serverPromises).then(function(){
			done();
		});
	});

	it("should pass", function(){
		chai.request('http://localhost:81').get('/test/about').end(function (err, res) {
				console.log(res.text)
			});
	});

	after(function(){
		serverInstances.forEach(function(serverInstance){
			serverInstance.stopServer();
		});
	});
});