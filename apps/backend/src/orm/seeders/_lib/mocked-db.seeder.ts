import { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { ReadonlyDeep } from "type-fest";
import { EntityDto } from "~/app/common/dtos/_lib/entity";
import { UserDto } from "~/app/common/dtos/user";

import { EntityBase } from "../../../app/_lib/entity";
import { User } from "../../../app/user/user.entity";

/**
 * The values for a DB which all data is mocked
 */
export interface MockedDb {
	/**
	 * Represents the [user]{@link UserDto} table
	 */
	users: readonly UserDto[];
}

/**
 * A seeder that seeds a full DB.
 */
export abstract class MockedDbSeeder extends Seeder {
	/**
	 * @throws {Error} When called from the abstract class
	 * @returns The mocked DB of this Seeder
	 */
	public static GetMockedDb() {
		const db = new (this.prototype.constructor as new () => MockedDbSeeder)().db;

		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- If the function is called
		if (!db) {
			throw new Error(
				"DB not set! Do not call this function from the `MockedDbSeeder` abstract class."
			);
		}

		return db;
	}

	/**
	 * The sample DB to seed
	 */
	protected abstract readonly db: ReadonlyDeep<MockedDb>;

	/**
	 * @inheritDoc
	 */
	public async run(em: EntityManager) {
		interface MockEntity {
			entity: new () => EntityBase;
			mocks: readonly EntityDto[];
		}

		const { users } = this.db;

		for (const { entity, mocks } of [{ entity: User, mocks: users }] satisfies MockEntity[]) {
			for (const mock of mocks) {
				em.create<EntityBase>(entity, mock);
			}

			// Confirm new rows
			await em.flush();

			// Need to update the sequence when entities are added manually
			const primaryKey: keyof EntityBase = "_id";
			// TODO: better (if the table name is set manually)
			const tblName = em.config.getNamingStrategy().classToTableName(entity.name);
			await em
				.getConnection()
				.execute(
					`SELECT SETVAL('${tblName}_${primaryKey}_seq', (SELECT MAX(${primaryKey}) from "${tblName}"))`
				);

			// Confirm sequence update
			await em.flush();
		}
	}
}
