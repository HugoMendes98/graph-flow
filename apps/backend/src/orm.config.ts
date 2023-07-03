import { LoggerNamespace } from "@mikro-orm/core/logging";
import { defineConfig } from "@mikro-orm/postgresql";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import { kebabCase } from "eslint-plugin-yml/lib/utils/casing";
import * as path from "path";

import { Category } from "./app/category/category.entity";
import { Node } from "./app/node/node.entity";
import { User } from "./app/user/user.entity";
import { Workflow } from "./app/workflow/workflow.entity";
import { getConfiguration } from "./configuration";
import { migrations } from "./orm/migrations";

const { debug, host, name, password, port, username } = getConfiguration().db;

/**
 * The path to the `orm` module folder
 */
const ormPath = path.join(__dirname, "orm");
/**
 * The suffixes for the generated file with the CLI.
 */
const suffixes = { migration: "migration", seeder: "seeder" };

/**
 * The configuration for `Mikro-orm`.
 * Used for CLI and the app.
 */
const ormConfig = defineConfig({
	// From configuration
	dbName: name,
	debug: debug as LoggerNamespace[] | boolean,
	host,
	password,
	port,
	user: username,

	// For app code
	discovery: { disableDynamicFileAccess: true },
	entities: [Category, Node, User, Workflow],
	forceUndefined: false,
	metadataProvider: TsMorphMetadataProvider,
	strict: true,
	type: "postgresql", // Only needed for the `MikroOrmHealthIndicator`
	validate: true,

	// For CLI
	migrations: {
		emit: "ts",
		fileName: className => `${className}.${suffixes.migration}`,
		migrationsList: migrations,
		pathTs: path.join(ormPath, "migrations"),
		snapshot: true,
		snapshotName: "snapshot"
	},
	seeder: {
		emit: "ts",
		fileName: className =>
			`${kebabCase(className).slice(0, -suffixes.seeder.length - 1)}.${suffixes.seeder}`,
		pathTs: path.join(ormPath, "seeders")
	}
});

export default ormConfig;
