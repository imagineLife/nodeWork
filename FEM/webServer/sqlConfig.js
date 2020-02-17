var util = require("util");

const setupSQL = (dbObj) => {
	return {
		run(...args) {
			return new Promise(function c(resolve,reject){
				dbObj.run(...args,function onResult(err){
					if (err) reject(err);
					else resolve(this);
				});
			});
		},
		get: util.promisify(dbObj.get.bind(dbObj)),
		all: util.promisify(dbObj.all.bind(dbObj)),
		exec: util.promisify(dbObj.exec.bind(dbObj))
	}
};

module.exports = setupSQL;