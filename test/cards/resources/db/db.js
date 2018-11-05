// db.js
"use strict";
const sqlite3 = require("sqlite3").verbose();

/**
 *
 */
async function main(resource, operation){
	var app = resource.root.parent;
	var workDir = await app.system.file.join(app.settings.folders.rc, resource.name);
	var absolutePath = await app.system.file.join(app.system.rootDir, workDir);
	var dbPath = await app.system.file.join(absolutePath, "db.db");

	return new Promise(function(resolve, reject){
		// Open database
		let db = new sqlite3.Database(dbPath, err => {
			if (err) {
				console.error(err.message);
			}
			console.log("Connected to database.");
		});

		// Analyze request

		// Query
		let sql = "SELECT * FROM words";

		db.all(sql, [], (err, rows) => {
			if (err) {
				throw err;
			}
			// Close the database
			db.close();

			resolve(rows[0].q);
		});
	});
}

module.exports = main;