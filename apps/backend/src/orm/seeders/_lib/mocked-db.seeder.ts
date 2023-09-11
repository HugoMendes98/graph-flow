import { EntityManager, Reference } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { EntityDto } from "~/lib/common/dtos/entity";
import { MockSeed } from "~/lib/common/seeds";

import { EntityBase } from "../../../app/_lib/entity";
import { AuthService } from "../../../app/auth/auth.service";
import { CategoryEntity } from "../../../app/category/category.entity";
import { GraphArcEntity } from "../../../app/graph/arc/graph-arc.entity";
import { GraphEntity } from "../../../app/graph/graph.entity";
import { NodeEntity } from "../../../app/node/node.entity";
import { UserEntity } from "../../../app/user/user.entity";
import { WorkflowEntity } from "../../../app/workflow/workflow.entity";

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

		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Could happen
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
	protected abstract readonly db: Readonly<MockSeed>;

	/**
	 * @inheritDoc
	 */
	public async run(em: EntityManager) {
		interface MockEntity {
			entity: new () => EntityBase;
			mocks: readonly EntityDto[];
		}

		// FIXME: Remove this (with another order or inserts ?)
		// Disable FK checks
		await em.getConnection().execute("SET session_replication_role = 'replica';");

		const {
			categories,
			graph: { arcs, graphs, nodes },
			users,
			workflows
		} = this.db;

		for (const { entity, mocks } of [
			{ entity: CategoryEntity, mocks: categories },
			{
				entity: UserEntity,
				mocks: await Promise.all(
					users.map(async ({ password, ...user }) => ({
						...user,
						password: await AuthService.hash(password)
					}))
				)
			},

			// Graphs
			{ entity: GraphEntity, mocks: graphs },
			{ entity: NodeEntity, mocks: nodes },
			{ entity: GraphArcEntity, mocks: arcs },

			{ entity: WorkflowEntity, mocks: workflows }
		] satisfies MockEntity[]) {
			for (const mock of mocks) {
				em.getRepository<EntityBase>(entity).create(mock);
			}

			// Confirm new rows
			await em.flush();

			// Need to update the sequence when entities are added manually
			const primaryKey: keyof EntityBase = "_id";
			// // TODO: better (if the table name is set manually)
			const tblName = em.config.getNamingStrategy().classToTableName(entity.name);
			await em
				.getConnection()
				.execute(
					`SELECT SETVAL('${tblName}_${primaryKey}_seq', (SELECT MAX(${primaryKey}) from "${tblName}"))`
				);

			// Confirm sequence update
			await em.flush();
		}

		// Enable FK checks
		await em.getConnection().execute("SET session_replication_role = 'origin';");

		for (const { __categories, _id } of nodes) {
			const node = await em.findOneOrFail(NodeEntity, _id, { populate: ["categories"] });
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Does exist with the `populate` option
			node.categories!.add(
				__categories.map(id => Reference.createFromPK(CategoryEntity, id))
			);
		}

		// Seeder always flush at the end
	}
}
