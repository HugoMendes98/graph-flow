/**
 * ----------------------
 * -- FOR TESTING ONLY --
 * Replace $_<var> or "$_<var>"
 * ----------------------
 */

const { EntitySchema, MikroORM } = require("@mikro-orm/core");
const { defineConfig } = require("@mikro-orm/postgresql");

module.exports = async () => {
	class Entity {}

	const orm = await MikroORM.init(
		defineConfig({
			dbName: "$[{_dbName}]",
			host: "$[{_dbHost}]",
			password: "$[{_dbPass}]",
			port: "$[{_dbPort}]",
			user: "$[{_dbUser}]",

			entities: [
				new EntitySchema({
					class: Entity,
					properties: { _id: { primary: true, type: "integer" } },
					tableName: "graph"
				})
			]
		})
	);

	return orm
		.connect()
		.then(em => em.nativeInsert(Entity, { _id: "$[{_value}]" }))
		.finally(() => orm.close(true));
};
