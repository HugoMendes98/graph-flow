import { NotFoundError } from "@mikro-orm/core";
import { Test, TestingModule } from "@nestjs/testing";
import { GraphNodeCreateDto, GraphNodeUpdateDto } from "~/lib/common/dtos/graph/node";

import { GraphNodeService } from "./graph-node.service";
import { DbTestHelper } from "../../../../test/db-test";
import { OrmModule } from "../../../orm/orm.module";
import { GraphModule } from "../graph.module";

describe("GraphNodeService", () => {
	let dbTest: DbTestHelper;
	let service: GraphNodeService;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [OrmModule, GraphModule]
		}).compile();

		dbTest = new DbTestHelper(module);
		service = module.get(GraphNodeService);
	});

	afterAll(() => dbTest.close());

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("CRUD basic", () => {
		let graphNodes: typeof dbTest.db.graph.graphNodes;

		beforeEach(() => {
			graphNodes = dbTest.db.graph.graphNodes;
		});

		describe("Read", () => {
			beforeEach(() => dbTest.refresh());

			it("should get one", async () => {
				for (const node of graphNodes) {
					const row = await service.findById(node._id);
					expect(row.toJSON()).toStrictEqual(node);
				}
			});

			it("should fail when getting one by an unknown id", async () => {
				const id = Math.max(...graphNodes.map(({ _id }) => _id)) + 1;
				await expect(service.findById(id)).rejects.toThrow(NotFoundError);
			});
		});

		describe("Create", () => {
			it("should add a new entity", async () => {
				const {
					graph: {
						graphs: [graph]
					},
					node: {
						nodes: [node]
					}
				} = dbTest.db;

				// Backup previous data
				const { data: before } = await service.findAndCount();

				const toCreate = {
					__graph: graph._id,
					__node: node._id,
					name: `graph-${node.name}`,
					position: { x: 123, y: 456 }
				} as const satisfies GraphNodeCreateDto;
				const created = await service.create(toCreate);
				expect(created.__graph).toBe(toCreate.__graph);
				expect(created.__node).toBe(toCreate.__node);
				expect(created.name).toBe(toCreate.name);
				expect(created.position.x).toBe(toCreate.position.x);
				expect(created.position.y).toBe(toCreate.position.y);

				// Check that the entity is in the data (should have one more than before)
				const { data: after } = await service.findAndCount();
				expect(after).toHaveLength(before.length + 1);

				// Check that the value returned in the list is equal to the one just created
				const found = after.find(({ _id }) => _id === created._id);
				expect(found).toBeDefined();
				expect(created.toJSON()).toStrictEqual(found!.toJSON());
			});
		});

		describe("Update", () => {
			beforeEach(() => dbTest.refresh());

			it("should update an entity", async () => {
				// Backup previous data
				const { data: before } = await service.findAndCount();

				// Update an entity and check its content
				const [node] = graphNodes;
				const toUpdate = {
					name: `${node.name}-${node.name}`,
					position: { x: node.position.x * 2, y: node.position.y * 2 }
				} as const satisfies GraphNodeUpdateDto;
				const updated = await service.update(node._id, toUpdate);
				expect(updated.name).toBe(toUpdate.name);
				expect(updated.position.x).toBe(toUpdate.position.x);
				expect(updated.position.y).toBe(toUpdate.position.y);

				// Check the data has still the same size
				const { data: after } = await service.findAndCount();
				expect(after).toHaveLength(before.length);

				// Check that the value returned in the list is equal to the one just updated
				const found = after.find(({ _id }) => _id === node._id);
				expect(found).toBeDefined();
				expect(updated.toJSON()).toStrictEqual(found!.toJSON());
			});
		});

		describe("Delete", () => {
			beforeEach(() => dbTest.refresh());

			it("should delete an entity", async () => {
				const [{ _id }] = graphNodes;
				const {
					pagination: { total: totalBefore }
				} = await service.findAndCount({ _id });
				expect(totalBefore).toBe(1);

				await service.delete(_id);
				const {
					pagination: { total: totalAfter }
				} = await service.findAndCount({ _id });
				expect(totalAfter).toBe(0);
			});

			it("should not delete an unknown id", async () => {
				const id = Math.max(...graphNodes.map(({ _id }) => _id)) + 1;
				await expect(service.delete(id)).rejects.toThrow(NotFoundError);
			});
		});
	});
});
