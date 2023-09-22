import { NotFoundError } from "@mikro-orm/core";
import { Test, TestingModule } from "@nestjs/testing";
import { GraphNode } from "~/lib/common/app/graph/endpoints";
import { NodeCreateDto, NodeUpdateDto } from "~/lib/common/app/node/dtos";
import { NodeBehaviorType } from "~/lib/common/app/node/dtos/behaviors/node-behavior.type";
import { NodeTriggerType } from "~/lib/common/app/node/dtos/behaviors/triggers";
import { NodeKindType } from "~/lib/common/app/node/dtos/kind/node-kind.type";
import { BASE_SEED } from "~/lib/common/seeds";

import { NodeReadonlyKindTypeException } from "./exceptions";
import { NodeInputRepository } from "./input";
import { NodeKindEdgeEntity } from "./kind";
import { NodeModule } from "./node.module";
import { NodeService } from "./node.service";
import { NodeOutputRepository } from "./output";
import { PositionEmbeddable } from "./position.embeddable";
import { DbTestHelper } from "../../../test/db-test";
import { OrmModule } from "../../orm/orm.module";
import { CategoryModule } from "../category/category.module";
import { CategoryService } from "../category/category.service";
import { GraphArcService } from "../graph/arc/graph-arc.service";
import {
	GraphNodeTriggerInFunctionException,
	GraphNodeTriggerInWorkflowException
} from "../graph/node/exceptions";

describe("NodeService", () => {
	let module: TestingModule;
	let service: NodeService;

	let dbTest: DbTestHelper;
	let db: typeof BASE_SEED;

	beforeAll(async () => {
		module = await Test.createTestingModule({
			imports: [CategoryModule, OrmModule, NodeModule]
		}).compile();

		service = module.get(NodeService);

		dbTest = new DbTestHelper(module);
		db = dbTest.db as never;
	});

	afterAll(() => dbTest.close());

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("With Categories", () => {
		let categoryService: CategoryService;
		let dbTestEmpty: DbTestHelper;

		beforeAll(async () => {
			categoryService = await module.get(CategoryService);
			dbTestEmpty = dbTest.transformTo("empty");
		});

		afterAll(() => dbTestEmpty.close());

		beforeEach(() => dbTestEmpty.refresh());

		const seed = async () => {
			const category1 = await categoryService.create({ name: "cat1" });
			const category2 = await categoryService.create({ name: "cat2" });

			const node1 = await service.create({
				behavior: { type: NodeBehaviorType.VARIABLE, value: 123 },
				kind: { active: false, type: NodeKindType.TEMPLATE },
				name: "node1"
			});
			const node2 = await service.create({
				behavior: { type: NodeBehaviorType.VARIABLE, value: 123 },
				kind: { active: false, type: NodeKindType.TEMPLATE },
				name: "node2"
			});

			await service.addCategory(node1._id, category1._id);
			await service.addCategory(node1._id, category2._id);
			await service.addCategory(node2._id, category1._id);

			return {
				categories: await Promise.all(
					[category1, category2].map(({ _id }) =>
						categoryService.findById(_id, { populate: { nodes: true } })
					)
				),
				nodes: await Promise.all(
					[node1, node2].map(({ _id }) =>
						service.findById(_id, { populate: { categories: true } })
					)
				)
			};
		};

		it("should add categories to a node", async () => {
			const {
				categories: [cat1, cat2],
				nodes: [node1, node2]
			} = await seed();

			expect(node1.categories).toHaveLength(2);
			expect(node2.categories).toHaveLength(1);

			expect(
				node1.categories
					.getItems()
					.map(({ _id }) => _id)
					.sort()
			).toStrictEqual([cat1._id, cat2._id].sort());
			expect(node2.categories.getItems()[0]._id).toBe(cat1._id);
			expect(node2.categories.getItems()[0].name).toBe(cat1.name);

			expect(cat1.nodes).toHaveLength(2);
			expect(cat2.nodes).toHaveLength(1);

			expect(
				cat1.nodes
					.getItems()
					.map(({ _id }) => _id)
					.sort()
			).toStrictEqual([node1._id, node2._id].sort());
			expect(cat2.nodes.getItems()[0]._id).toBe(node1._id);
			expect(cat2.nodes.getItems()[0].name).toBe(node1.name);
		});

		it("should remove categories from a node", async () => {
			const {
				categories: [catA, catB],
				nodes: [nodeA, nodeB]
			} = await seed();

			const node1 = await service.removeCategory(nodeA._id, catB._id);
			const node2 = await service.removeCategory(nodeB._id, catA._id);
			expect(node1.categories).toHaveLength(1);
			expect(node2.categories).toHaveLength(0);

			expect(node1.categories.getItems()[0]._id).toBe(catA._id);

			const cat1 = await categoryService.findById(catA._id, { populate: { nodes: true } });
			const cat2 = await categoryService.findById(catB._id, { populate: { nodes: true } });
			expect(cat1.nodes).toHaveLength(1);
			expect(cat2.nodes).toHaveLength(0);

			expect(cat1.nodes.getItems()[0]._id).toBe(node1._id);
		});

		it("should remove categories from node when a category is deleted", async () => {
			const {
				categories: [catA, catB],
				nodes: [nodeA, nodeB]
			} = await seed();

			await categoryService.delete(catA._id);

			const node1 = await service.findById(nodeA._id, { populate: { categories: true } });
			const node2 = await service.findById(nodeB._id, { populate: { categories: true } });
			expect(node1.categories).toHaveLength(1);
			expect(node2.categories).toHaveLength(0);

			expect(node1.categories.getItems()[0]._id).toBe(catB._id);
		});

		it("should remove nodes from category when a node is deleted", async () => {
			const {
				categories: [catA, catB],
				nodes: [nodeA, nodeB]
			} = await seed();

			await service.delete(nodeA._id);

			const cat1 = await categoryService.findById(catA._id, { populate: { nodes: true } });
			const cat2 = await categoryService.findById(catB._id, { populate: { nodes: true } });
			expect(cat1.nodes).toHaveLength(1);
			expect(cat2.nodes).toHaveLength(0);

			expect(cat1.nodes.getItems()[0]._id).toBe(nodeB._id);
		});
	});

	describe("With Graph", () => {
		beforeAll(() => dbTest.refresh());

		it("should fail when adding more that one 'trigger' node in a `workflow`", async () => {
			// The 3rd graph is empty and linked to a 'workflow'
			const [, graph] = db.graph.graphs;

			await expect(() =>
				service.create({
					behavior: {
						trigger: { cron: "* * * * *", type: NodeTriggerType.CRON },
						type: NodeBehaviorType.TRIGGER
					},
					kind: { __graph: graph._id, position: { x: 0, y: 0 }, type: NodeKindType.EDGE },
					name: "new-trigger"
				})
			).rejects.toThrow(GraphNodeTriggerInWorkflowException);
		});

		it("should fail when adding any 'trigger' node in a `node-function`", async () => {
			// The first graph is linked to a 'node-function'
			const [graph] = db.graph.graphs;

			await expect(() =>
				service.create({
					behavior: {
						trigger: { cron: "* * * * *", type: NodeTriggerType.CRON },
						type: NodeBehaviorType.TRIGGER
					},
					kind: { __graph: graph._id, position: { x: 0, y: 0 }, type: NodeKindType.EDGE },
					name: "new-trigger"
				})
			).rejects.toThrow(GraphNodeTriggerInFunctionException);
		});

		// TODO: Test that a node-function 'A' is not used in another function 'B'
		//  if using itself the node-function 'B'.
		//	B uses A, A uses B, B uses A, A uses B, ...

		// This currently creates an infinite loop.
		// With conditional nodes, it can work.
	});

	describe("With Input/Outputs and Arcs", () => {
		beforeEach(() => dbTest.refresh());

		it("should remove inputs and arcs when deleting a node", async () => {
			const graphArcService = module.get(GraphArcService);

			const node = await service.findById(db.graph.nodes[4]._id);
			// For test verification; do not use a possibly used node if it is "locked"
			const { __graph } = node.kind as NodeKindEdgeEntity;
			expect(__graph).toBe(2);

			const { inputs, outputs } = node;
			const { data: arcs } = await graphArcService.findAndCount({
				$or: [{ from: { node: { _id: node._id } } }, { to: { node: { _id: node._id } } }]
			});

			// Need to have some data before
			expect(arcs).not.toHaveLength(0);
			expect(inputs).not.toHaveLength(0);
			expect(outputs).not.toHaveLength(0);

			await service.delete(node._id);

			// search by ids so that is not linked with the foreign keys
			const {
				pagination: { total: totalArcs }
			} = await graphArcService.findAndCount({ _id: { $in: arcs.map(({ _id }) => _id) } });
			expect(totalArcs).toBe(0);

			for (const [repository, entities] of [
				[module.get(NodeInputRepository), inputs],
				[module.get(NodeOutputRepository), outputs]
			] as const) {
				const [, total] = await repository.findAndCount({
					_id: { $in: entities.getItems().map(({ _id }) => _id) }
				});
				expect(total).toBe(0);
			}
		});
	});

	describe("Behavior: 'Reference'", () => {
		beforeEach(() => dbTest.refresh());

		it("should copy inputs/outputs on creation", async () => {
			const reference = await service.findById(db.graph.nodes[0]._id);

			const { inputs, outputs } = await service.create({
				behavior: { __node: reference._id, type: NodeBehaviorType.REFERENCE },
				kind: { __graph: 1, position: { x: 0, y: 0 }, type: NodeKindType.EDGE },
				name: `${reference.name} (ref)`
			});

			expect(inputs).toHaveLength(reference.inputs.length);
			expect(outputs).toHaveLength(reference.outputs.length);

			for (const [i, input] of inputs.getItems().entries()) {
				const inputRef = reference.inputs[i];
				expect(input.__ref).toBe(inputRef._id);
				expect(input.type).toBe(inputRef.type);
				expect(input._created_at).not.toStrictEqual(inputRef._created_at);
			}
			for (const [i, output] of outputs.getItems().entries()) {
				const outputRef = reference.outputs[i];
				expect(output.__ref).toBe(outputRef._id);
				expect(output.type).toBe(outputRef.type);
				expect(output._created_at).not.toStrictEqual(outputRef._created_at);
			}
		});
	});

	describe("Kind", () => {
		beforeEach(() => dbTest.refresh());

		it("should not allow to change the type on an update", async () => {
			const node = await service.findById(db.graph.nodes[0]._id);
			expect(node.kind.type).toBe(NodeKindType.EDGE);

			await expect(() =>
				service.update(node._id, { kind: { active: true, type: NodeKindType.TEMPLATE } })
			).rejects.toThrow(NodeReadonlyKindTypeException);
		});
	});

	describe("CRUD basic", () => {
		describe("Read", () => {
			beforeEach(() => dbTest.refresh());

			it("should get one", async () => {
				// eslint-disable-next-line unused-imports/no-unused-vars -- to remove from object
				for (const { __categories: _, ...node } of dbTest.db.graph.nodes) {
					const row = await service.findById(node._id);
					expect(row.toJSON()).toStrictEqual(node);
				}
			});

			it("should fail when getting one by an unknown id", async () => {
				const id = Math.max(...dbTest.db.graph.nodes.map(({ _id }) => _id)) + 1;
				await expect(service.findById(id)).rejects.toThrow(NotFoundError);
			});
		});

		describe("Create", () => {
			beforeEach(() => dbTest.refresh());

			it("should add a new entity", async () => {
				const { data: before } = await service.findAndCount();

				const toCreate: NodeCreateDto = {
					behavior: { type: NodeBehaviorType.VARIABLE, value: 123 },
					kind: { active: false, type: NodeKindType.TEMPLATE },
					name: "new-node"
				};
				const created = await service.create(toCreate);
				expect(created.behavior.type).toBe(toCreate.behavior.type);
				expect(created.name).toBe(toCreate.name);

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
				const [node] = dbTest.db.graph.nodes;
				const toUpdate: NodeUpdateDto = { name: `${node.name}-${node.name}` };
				const updated = await service.update(node._id, toUpdate);
				expect(updated.name).toBe(toUpdate.name);

				// Check the data has still the same size
				const { data: after } = await service.findAndCount();
				expect(after).toHaveLength(before.length);

				// Check that the value returned in the list is equal to the one just updated
				const found = after.find(({ _id }) => _id === node._id);
				expect(found).toBeDefined();
				expect(updated.toJSON()).toStrictEqual(found!.toJSON());
			});

			it("should update a node position", async () => {
				const {
					data: [{ _id, kind }]
				} = await service.findByGraph(1, {}, { limit: 1 });

				const position: PositionEmbeddable = {
					x: kind.position.x * 2,
					y: kind.position.y + 2
				};

				const updated = await service.update(_id, {
					kind: { position, type: NodeKindType.EDGE }
				});

				expect((updated as unknown as GraphNode).kind.position.x).toBe(position.x);
				expect((updated as unknown as GraphNode).kind.position.y).toBe(position.y);
			});
		});

		describe("Delete", () => {
			beforeEach(() => dbTest.refresh());

			it("should delete an entity", async () => {
				const { _id } = await service.create({
					behavior: { type: NodeBehaviorType.VARIABLE, value: 123 },
					kind: { active: false, type: NodeKindType.TEMPLATE },
					name: "__new__"
				});
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
				const id = Math.max(...dbTest.db.graph.nodes.map(({ _id }) => _id)) + 1;
				await expect(service.delete(id)).rejects.toThrow(NotFoundError);
			});
		});
	});
});
