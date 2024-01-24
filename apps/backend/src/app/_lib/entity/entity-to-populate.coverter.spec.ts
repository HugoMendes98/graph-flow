import { Collection } from "@mikro-orm/core";
import { EntityDto } from "~/lib/common/dtos/entity";
import { EntitiesToPopulate } from "~/lib/common/endpoints";

import { entityToPopulateToRelationsKeys } from "./entity-to-populate.coverter";
import { EntityRelationKeysDeep } from "./entity.types";

describe("entityToPopulateToRelationsKeys", () => {
	type EntityC = EntityDto;

	interface EntityB extends EntityDto {
		cs?: Collection<EntityC>;
	}

	interface EntityA extends EntityDto {
		b: EntityB;
		bs: EntityB[];
		cs: Collection<EntityB>;
		d: EntityB | null;
	}

	it("should convert correctly", () => {
		for (const [toPopulate, keys] of [
			[{ b: true }, ["b"]],
			[{ b: {} }, ["b"]],
			[{ b: true, bs: {} }, ["b", "bs"]],
			[
				{ b: { cs: true }, bs: { cs: true }, cs: { cs: {} } },
				["b.cs", "bs.cs", "cs.cs"]
			],
			[{ d: { cs: true } }, ["d.cs"]]
		] satisfies Array<
			[
				EntitiesToPopulate<EntityA>,
				Array<EntityRelationKeysDeep<EntityA>>
			]
		>) {
			expect(entityToPopulateToRelationsKeys(toPopulate)).toStrictEqual(
				keys
			);
		}
	});
});
