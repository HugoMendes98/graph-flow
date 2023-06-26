import { MikroORM } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { INestApplicationContext } from "@nestjs/common";

import { DbTestSample } from "./db-test.sample";
import { MockedDbSeeder } from "../../src/orm/seeders/_lib/mocked-db.seeder";
import { DbBaseSeeder } from "../../src/orm/seeders/db.base.seeder";

export interface DbTestHelperParams {
	/**
	 * What is the sample of database to use
	 *
	 * @default "base"
	 */
	sample?: DbTestSample;
}

export class DbTestHelper {
	private readonly orm: MikroORM;
	private readonly seeder: typeof MockedDbSeeder;

	/**
	 * @returns The initial data used to seed the DB
	 */
	public get db() {
		return this.seeder.GetMockedDb();
	}

	public constructor(module: INestApplicationContext, params?: DbTestHelperParams) {
		this.orm = module.get(MikroORM);

		switch (params?.sample ?? "base") {
			case "base":
				this.seeder = DbBaseSeeder;
				break;

			default:
				throw new Error(`No sample found for ${params?.sample ?? "base"}`);
		}
	}

	/**
	 * Closes the connexion to the DB.
	 *
	 * @returns nothing
	 */
	public close() {
		return this.orm.close(true);
	}

	/**
	 * Drops the DB and seeds with the `db`
	 */
	public async refresh() {
		await this.orm.getSchemaGenerator().refreshDatabase();
		await this.orm.getSeeder().seed(this.seeder as typeof MockedDbSeeder & (new () => Seeder));
		this.orm.em.clear();
	}
}
