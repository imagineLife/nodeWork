async function getAllRecords(sqlObj) {
	var result = await sqlObj.all(
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

async function insertSomething(sqlObj, otherID,something) {
	const somethingRes = await sqlObj.run(
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

async function getOtherID(sqlObj, other) {

	//get other from db
	var result = await sqlObj.get(
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
		result = await sqlObj.run(
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

module.exports = {
	getAllRecords,
	insertSomething,
	getOtherID
}