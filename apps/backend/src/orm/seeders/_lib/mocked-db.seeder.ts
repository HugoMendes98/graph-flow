import { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { ReadonlyDeep } from "type-fest";
import { EntityDto } from "~/app/common/dtos/_lib/entity";
import { CategoryDto } from "~/app/common/dtos/category";
import { UserDto } from "~/app/common/dtos/user";
import { WorkflowDto } from "~/app/common/dtos/workflow";

import { EntityBase } from "../../../app/_lib/entity";
import { Category } from "../../../app/category/category.entity";
import { User } from "../../../app/user/user.entity";
import { Workflow } from "../../../app/workflow/workflow.entity";

/**
 * The values for a DB which all data is mocked
 */
export interface MockedDb {
	/**
	 * Represents the [category]{@link CategoryDto} table
	 */
	categories: readonly CategoryDto[];
	/**
	 * Represents the [user]{@link UserDto} table
	 */
	users: readonly UserDto[];
	/**
	 * Represents the [workflow]{@link WorkflowDto} table
	 */
	workflows: readonly WorkflowDto[];
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

		const { categories, users, workflows } = this.db;

		for (const { entity, mocks } of [
			{ entity: Category, mocks: categories },
			{ entity: User, mocks: users },
			{ entity: Workflow, mocks: workflows }
		] satisfies MockEntity[]) {
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
