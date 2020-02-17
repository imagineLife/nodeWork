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

/*
	https://github.com/anseki/node-static-alias
	serve static files
*/ 
var staticAlias = require("node-static-alias");
const DB_PATH = path.join(__dirname,"my.db");
const WEB_PATH = path.join(__dirname,"web");
const HTTP_PORT = 8039;

const setupSQL = require('./sqlConfig')

var delay = util.promisify(setTimeout);

// define some SQLite3 database helpers
//   (comment out if sqlite3 not working for you)
var myDB = new sqlite3.Database(DB_PATH);
var SQL3 = setupSQL(myDB)

var fileServer = new staticAlias.Server(WEB_PATH,{
	cache: 100,
	serverInfo: "Node Workshop: ex5",
	alias: [
		{
			//if index or index-anything...
			match: /^\/(?:index\/?)?(?:[?#].*$)?$/, 
			serve: "index.html",
			force: true,
		},
		{
			match: /^\/js\/.+$/,
			serve: "<% absPath %>",
			force: true,
		},
		{
			match: /^\/(?:[\w\d]+)(?:[\/?#].*$)?$/,
			serve: function onMatch(params) {
				return `${params.basename}.html`;
			},
		},
		{
			match: /[^]/,
			serve: "404.html",
		},
	],
});

var httpserv = http.createServer(handleRequest);

main();


// ************************************

function main() {
	httpserv.listen(HTTP_PORT);
	console.log(`Listening on http://localhost:${HTTP_PORT}...`);
}

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
	if (/\/hello\b/.test(req.url)) {
		res.writeHead(200, {'Content-Type': "text/html"})
		return res.end('Simple Text')
	}
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