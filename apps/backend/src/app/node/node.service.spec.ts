import { NotFoundError } from "@mikro-orm/core";
import { Test, TestingModule } from "@nestjs/testing";
import { NodeCreateDto, NodeUpdateDto } from "~/lib/common/app/node/dtos";
import { NodeBehaviorType } from "~/lib/common/app/node/dtos/behaviors";

import { NodeModule } from "./node.module";
import { NodeService } from "./node.service";
import { DbTestHelper } from "../../../test/db-test";
import { OrmModule } from "../../orm/orm.module";
import { CategoryModule } from "../category/category.module";
import { CategoryService } from "../category/category.service";

describe("NodeService", () => {
	let module: TestingModule;
	let dbTest: DbTestHelper;
	let service: NodeService;

	beforeAll(async () => {
		module = await Test.createTestingModule({
			imports: [CategoryModule, OrmModule, NodeModule]
		}).compile();

		dbTest = new DbTestHelper(module);
		service = module.get(NodeService);
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
				behavior: { type: NodeBehaviorType.VARIABLE },
				name: "node1"
			});
			const node2 = await service.create({
				behavior: { type: NodeBehaviorType.VARIABLE },
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

	describe("CRUD basic", () => {
		describe("Read", () => {
			beforeEach(() => dbTest.refresh());

			it("should get one", async () => {
				// eslint-disable-next-line unused-imports/no-unused-vars -- to remove from object
				for (const { __categories: _, ...node } of dbTest.db.node.nodes) {
					const row = await service.findById(node._id);
					expect(row.toJSON()).toStrictEqual(node);
				}
			});

			it("should fail when getting one by an unknown id", async () => {
				const id = Math.max(...dbTest.db.node.nodes.map(({ _id }) => _id)) + 1;
				await expect(service.findById(id)).rejects.toThrow(NotFoundError);
			});
		});

		describe("Create", () => {
			beforeEach(() => dbTest.refresh());

			it("should add a new entity", async () => {
				const { data: before } = await service.findAndCount();

				const toCreate: NodeCreateDto = {
					behavior: { type: NodeBehaviorType.VARIABLE },
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
				const [node] = dbTest.db.node.nodes;
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
		});

		describe("Delete", () => {
			beforeEach(() => dbTest.refresh());

			it("should delete an entity", async () => {
				const { _id } = await service.create({
					behavior: { type: NodeBehaviorType.VARIABLE },
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
				const id = Math.max(...dbTest.db.node.nodes.map(({ _id }) => _id)) + 1;
				await expect(service.delete(id)).rejects.toThrow(NotFoundError);
			});
		});
	});
});
