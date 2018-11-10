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
			case "japanese": {
				let promises = new Array();
				for (var i = 1; i <= 56; i++){
					let sql = "INSERT OR REPLACE INTO scores(user_id, pool_name, card_id) VALUES (0, 'japanese', " + i + ");";
					promises.push(new Promise(function(resolve, reject){
						db.all(sql, [], (err, rows) => {
							if (err) {
								console.log(err);
							}

							// Resolve
							resolve();
						});
					}));
				}
				Promise.all(promises).then(function(values){
					// Close the database
					db.close();
					resolve("Query completed.");
				})
				break;
			}
			case undefined: {
				// Query
				let sql = "SELECT a.*, 'a' AS src FROM (SELECT card_id FROM scores WHERE card_id IN (SELECT card_id FROM scores WHERE last_score != 3 OR last_score IS NULL ORDER BY touch_date DESC LIMIT 5) ORDER BY touch_date ASC LIMIT 1) a UNION SELECT b.*, 'b' AS src FROM (SELECT card_id FROM scores ORDER BY touch_date ASC LIMIT 1) b ORDER BY src ASC";
				db.all(sql, [], (err, rows) => {
					if (err) {
						throw err;
					}
					// Close the database
					db.close();
					resolve(JSON.stringify(rows[0].card_id));
				});
				break;
			}
			default: {
				let values = resource.in.split(",");
				let sql = "INSERT OR REPLACE INTO scores(user_id, pool_name, card_id, rehearsal_count, total_score, last_score, touch_date) VALUES (" +
					// user_id
					"0, " +
					// pool_name
					"'japanese', " +
					// card_id
					values[0] + ", " +
					// rehearsal_count
					"(SELECT rehearsal_count FROM scores WHERE user_id = " + values[0] + ") + 1, " +
					// total_score
					"(SELECT total_score FROM scores WHERE user_id = " + values[0] + ") + " + values[1] + ", " +
					// last_score
					values[1] + ", " +
					// touch_date
					Math.floor(Date.now()/1000) + ");";
				db.all(sql, [], (err, rows) => {
					if (err) {
						console.log(sql)
					}
					// Close the database
					db.close();
					resolve("Query completed.");
				});
			}
		}
	});
}

module.exports = main;