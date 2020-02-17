#!/usr/bin/env node
"use strict";

/*
	An API endpoint that serves the records from the db
	to a webpage
*/

var util = require("util");
var path = require("path");
var http = require("http");
var sqlite3 = require("sqlite3");

const DB_PATH = path.join(__dirname,"my.db");
const WEB_PATH = path.join(__dirname,"web");
const HTTP_PORT = 8039;

const setupSQL = require('./sqlConfig')
const makeFileServer = require('./fileServer')

//ROUTES
const helloHandler = require('./routeHandlers/hello')

var delay = util.promisify(setTimeout);

// define some SQLite3 database helpers
//   (comment out if sqlite3 not working for you)
var myDB = new sqlite3.Database(DB_PATH);
var SQL3 = setupSQL(myDB)

var fileServer = makeFileServer(WEB_PATH)

var httpserv = http.createServer(handleRequest);

httpserv.listen(HTTP_PORT);
console.log(`Listening on http://localhost:${HTTP_PORT}...`);

async function handleRequest(req,res) {
	if (/\/get-records\b/.test(req.url)) {
		await delay(1000);

		let records = await getAllRecords() || [];
		res.writeHead(200,{
			"Content-Type": "application/json",
			"Cache-Control": "max-age: 0, no-cache",
		});
		return res.end(JSON.stringify(records));
	}
	if (/\/hello\b/.test(req.url)) helloHandler(req,res)
	else {
		//send to the fileServer
		fileServer.serve(req,res);
	}
}

// *************************
// NOTE: if sqlite3 is not working for you,
//   comment this version out
// *************************
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