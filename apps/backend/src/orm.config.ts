import { UnderscoreNamingStrategy } from "@mikro-orm/core";
import { LoggerNamespace } from "@mikro-orm/core/logging";
import { defineConfig } from "@mikro-orm/postgresql";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import { kebabCase } from "eslint-plugin-yml/lib/utils/casing";
import * as path from "path";

import { CategoryEntity } from "./app/category/category.entity";
import { GRAPH_ENTITIES } from "./app/graph/graph.entities";
import { NODE_ENTITIES } from "./app/node/node.entities";
import { UserEntity } from "./app/user/user.entity";
import { WorkflowEntity } from "./app/workflow/workflow.entity";
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

/** @internal */
class NamingStrategy extends UnderscoreNamingStrategy {
	public override classToTableName(entityName: string): string {
		const tableName = super.classToTableName(entityName);

		const suffix = "_entity";
		return tableName.endsWith(suffix) ? tableName.slice(0, -suffix.length) : tableName;
	}
}

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
	entities: [CategoryEntity, ...GRAPH_ENTITIES, ...NODE_ENTITIES, UserEntity, WorkflowEntity],
	forceUndefined: false,
	metadataProvider: TsMorphMetadataProvider,
	namingStrategy: NamingStrategy,
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
