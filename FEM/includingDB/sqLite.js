#!/usr/bin/env node

"use strict";


/*
	GOAL HERE
	- connect to db
	- through cli, interact w. db
		- store
		- get
		- sqlite3 because...
			- file is maintained by the app
			- modifies files directly
			- don't hafta administer a separate server

	- Make a cli
		can pass a val as cli arg
		puts vals in a db record
		can dump db content


		RUN USING
*/
var util = require("util");
var path = require("path");
var fs = require("fs");
var sqlite3 = require("sqlite3");

// ************************************

async function insertSomething(otherID,something) {
	const somethingRes = await SQL3.run(
		`
		INSERT INTO
			Something
			(otherID, data)
		VALUES
			(?, ?)
		`,
		otherID,
		something
	);

	if (
		somethingRes != null &&
		somethingRes.changes > 0
	) {
		return true;
	}
}

async function getAllRecords() {
	var result = await SQL3.all(
		`
		SELECT
			Something.data AS "something",
			Other.data AS "other"
		FROM
			Something
			JOIN Other ON (Something.otherID = Other.id)
		ORDER BY
			Other.id DESC, Something.data
		`
	);

	return result;
}

function error(err) {
	if (err) {
		console.error(err.toString());
		console.log("");
	}
}

//DB CONFIG PATHS
const DB_PATH = path.join(__dirname,"my.db");

//a sibling file
// contains a 'something' table and an 'other' table
const DB_SQL_PATH = path.join(__dirname,"dbSchema.sql");

var args = require("minimist")(process.argv.slice(2),{
	string: ["other",],
});

main().catch(console.error);


// ************************************

var SQL3;

//ASYNC 'MAIN' fn
async function main() {
	if (!args.other) {
		error("Missing param -> '--other=..'");
		return;
	}

	/*
		Init the DB in app memory
		Creating a db file
	*/
	var myDB = new sqlite3.Database(DB_PATH);
	
	/*
		4 sql helper methods
		run, get, all exec
	*/
	SQL3 = {
		run(...args) {
			return new Promise(function c(resolve,reject){
				myDB.run(...args,function onResult(err){
					if (err) reject(err);
					else resolve(this);
				});
			});
		},

		/*
			util.promisify
			pass it a fn that expects callbacks,
			get back a fn that gives me a promise
		*/

		get: util.promisify(myDB.get.bind(myDB)),
		all: util.promisify(myDB.all.bind(myDB)),
		exec: util.promisify(myDB.exec.bind(myDB)),
	};

	//LOAD/'init' sql from file
	var initSQL = fs.readFileSync(DB_SQL_PATH,"utf-8");

	//init against db
	// WAIT till init the sql
	await SQL3.exec(initSQL);


	//cli arg: --other
	var other = args.other;
	
	//random number
	var something = Math.trunc(Math.random() * 1E9);


	var otherID = await getOtherID(other);
	
	/*
		Once OTHER is inserted,
		insert SOMETHING into other table
	*/
	if (otherID != null) {
		let somethingInserted = await insertSomething(otherID,something);
		
		if (somethingInserted) {

			//get && show db records
			let records = await getAllRecords();
			console.table( records );
			return;
		}
	}

	error("Oops!");
}

async function getOtherID(other) {

	//get other from db
	var result = await SQL3.get(
		`
		SELECT
			id
		FROM
			Other
		WHERE
			data = ?
		`,
		other
	);

	if (result != null) {
		return result.id;
	}

	//if not in db, INSERT into db
	else {
		result = await SQL3.run(
			`
			INSERT INTO
				Other
			(data)
			VALUES
				(?)
			`,
			other
		);

		if (
			result != null &&
			result.changes > 0
		) {
			return result.lastID;
		}
	}
}