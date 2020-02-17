/*
	https://github.com/anseki/node-static-alias
	serve static files
*/ 
var staticAlias = require("node-static-alias");

const makeFileServer = (serverPath) => {
	return new staticAlias.Server(serverPath,{
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
}

module.exports = makeFileServer;