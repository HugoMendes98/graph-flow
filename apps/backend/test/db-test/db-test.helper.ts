import { MikroORM } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { INestApplicationContext } from "@nestjs/common";

import { DbTestSample } from "./db-test.sample";
import { MockedDbSeeder } from "../../src/orm/seeders/_lib/mocked-db.seeder";
import { DbBaseSeeder } from "../../src/orm/seeders/db.base.seeder";
import { DbEmptySeeder } from "../../src/orm/seeders/db.empty.seeder";
import { DbOnlyNodesSeeder } from "../../src/orm/seeders/db.only-nodes.seeder";

export interface DbTestHelperParams {
	/**
	 * What is the sample of database to use
	 *
	 * @default "base"
	 */
	sample?: DbTestSample;
}

/**
 * Class that helps manage the database when testing
 */
export class DbTestHelper {
	/**
	 * The number of DbHelper "opened"
	 */
	private static connection = 0;

	private readonly orm: MikroORM;
	private readonly seeder: typeof MockedDbSeeder;

	/**
	 * @returns The initial data used to seed the DB
	 */
	public get db() {
		return this.seeder.GetMockedDb();
	}

	public constructor(
		private readonly module: INestApplicationContext,
		params?: DbTestHelperParams
	) {
		switch (params?.sample ?? "base") {
			case "base":
				this.seeder = DbBaseSeeder;
				break;
			case "empty":
				this.seeder = DbEmptySeeder;
				break;
			case "only-nodes":
				this.seeder = DbOnlyNodesSeeder;
				break;

			default:
				throw new Error(`No sample found for ${params?.sample ?? "base"}`);
		}

		this.orm = module.get(MikroORM);
		// Increase the number of "active" connection
		++DbTestHelper.connection;
	}

	/**
	 * @param sample the sample to use
	 * @returns A new transformed DbHelper (do not forget to close it)
	 */
	public transformTo(sample: DbTestSample) {
		return new DbTestHelper(this.module, { sample });
	}

	/**
	 * Closes the connection to the DB.
	 */
	public async close() {
		this.orm.em.clear();

		if (--DbTestHelper.connection === 0) {
			await this.orm.close(true);
		}
	}

	/**
	 * Drops the DB and seeds with the `db`
	 */
	public async refresh() {
		this.orm.em.clear();
		await this.orm.getSchemaGenerator().refreshDatabase();
		await this.orm.getSeeder().seed(this.seeder as typeof MockedDbSeeder & (new () => Seeder));
		this.orm.em.clear();
	}
}
