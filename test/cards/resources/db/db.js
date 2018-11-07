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
	var dbPath = await app.system.file.join(absolutePath, "cards.db");

	return new Promise(function(resolve, reject){
		// Open database
		let db = new sqlite3.Database(dbPath, err => {
			if (err) {
				console.error(err.message);
			}
			console.log("Connected to database.");
			console.log(resource);
		});

		// Analyze request
		switch(resource.in){
			case "japanese":
			// for (var i in app.resources.)
			break;

			default:
			// Query
			let sql = "SELECT card_id FROM scores WHERE touch_date IS NOT NULL ORDER BY touch_date";
			db.all(sql, [], (err, rows) => {
				if (err) {
					throw err;
				}
				// Close the database
				db.close();
				console.log(rows);
				resolve(rows[0].card_id);
			});
		}
	});
}

module.exports = main;