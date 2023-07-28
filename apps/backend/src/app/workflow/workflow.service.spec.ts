import { NotFoundError, UniqueConstraintViolationException } from "@mikro-orm/core";
import { Test, TestingModule } from "@nestjs/testing";
import { WorkflowCreateDto, WorkflowUpdateDto } from "~/lib/common/dtos/workflow";

import { WorkflowModule } from "./workflow.module";
import { WorkflowService } from "./workflow.service";
import { DbTestHelper } from "../../../test/db-test";
import { OrmModule } from "../../orm/orm.module";
import { GraphService } from "../graph/graph.service";

describe("WorkflowService", () => {
	let dbTest: DbTestHelper;
	let graphService: GraphService;
	let service: WorkflowService;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [OrmModule, WorkflowModule]
		}).compile();

		dbTest = new DbTestHelper(module);
		service = module.get<WorkflowService>(WorkflowService);
		graphService = module.get(GraphService);
	});

	afterAll(() => dbTest.close());

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("With Graph", () => {
		beforeEach(() => dbTest.refresh());

		it("should have a graph linked when a workflow is created", async () => {
			const workflow = await service.create({ name: "A new workflow" });
			expect(workflow.__graph).toBeNumber();

			const {
				pagination: { total }
			} = await graphService.findAndCount({ _id: workflow.__graph }, { limit: 0 });
			expect(total).toBe(1);
		});

		it("should delete the graph when a workflow is deleted", async () => {
			const [workflow] = dbTest.db.workflows;

			const {
				pagination: { total: before }
			} = await graphService.findAndCount({ _id: workflow.__graph }, { limit: 0 });
			expect(before).toBe(1);

			await service.delete(workflow._id);

			const {
				pagination: { total: after }
			} = await graphService.findAndCount({ _id: workflow.__graph }, { limit: 0 });
			expect(after).toBe(0);
		});
	});

	describe("CRUD basic", () => {
		describe("Read", () => {
			beforeAll(() => dbTest.refresh());

			it("should get one", async () => {
				for (const workflow of dbTest.db.workflows) {
					const row = await service.findById(workflow._id);
					expect(row.toJSON()).toStrictEqual(workflow);
				}
			});

			it("should fail when getting one by an unknown id", async () => {
				const id = Math.max(...dbTest.db.workflows.map(({ _id }) => _id)) + 1;
				await expect(service.findById(id)).rejects.toThrow(NotFoundError);
			});

			describe("Find many", () => {
				it("should return all", async () => {
					const { workflows } = dbTest.db;
					const {
						data,
						pagination: { total }
					} = await service.findAndCount();

					expect(data).toHaveLength(total);
					expect(data).toHaveLength(workflows.length);
					expect(data.map(d => d.toJSON())).toStrictEqual(workflows);
				});

				it("should count", async () => {
					const {
						workflows: { length }
					} = dbTest.db;
					const count = await service.count();

					expect(count).toBe(length);
				});
			});
		});

		describe("Create", () => {
			beforeEach(() => dbTest.refresh());

			it("should add a new entity", async () => {
				const { data: before } = await service.findAndCount();

				const toCreate: WorkflowCreateDto = { name: "a new workflow" };
				const created = await service.create(toCreate);
				expect(created.name).toBe(toCreate.name);

				// Check that the entity is in the data (should have one more than before)
				const { data: after } = await service.findAndCount();
				expect(after).toHaveLength(before.length + 1);

				// Check that the value returned in the list is equal to the one just created
				const found = after.find(({ _id }) => _id === created._id);
				expect(found).toBeDefined();
				expect(created.toJSON()).toStrictEqual(found!.toJSON());
			});

			it("should fail when a uniqueness constraint is not respected", async () => {
				const toCreate: WorkflowCreateDto = { name: dbTest.db.workflows[0].name };
				await expect(service.create(toCreate)).rejects.toThrow(
					UniqueConstraintViolationException
				);
			});
		});

		describe("Update", () => {
			beforeEach(() => dbTest.refresh());

			it("should update an entity", async () => {
				// Backup previous data
				const { data: before } = await service.findAndCount();

				// Update an entity and check its content
				const [workflow] = dbTest.db.workflows;
				const toUpdate: WorkflowUpdateDto = { name: `${workflow.name}-${workflow.name}` };
				const updated = await service.update(workflow._id, toUpdate);
				expect(updated.name).toBe(toUpdate.name);

				// Check the data has still the same size
				const { data: after } = await service.findAndCount();
				expect(after).toHaveLength(before.length);

				// Check that the value returned in the list is equal to the one just updated
				const found = after.find(({ _id }) => _id === workflow._id);
				expect(found).toBeDefined();
				expect(updated.toJSON()).toStrictEqual(found!.toJSON());
			});

			it("should fail when a uniqueness constraint is not respected", async () => {
				const [workflow1, workflow2] = dbTest.db.workflows;

				const toUpdate: WorkflowUpdateDto = { name: workflow1.name };
				await expect(service.update(workflow2._id, toUpdate)).rejects.toThrow(
					UniqueConstraintViolationException
				);
			});
		});

		describe("Delete", () => {
			beforeEach(() => dbTest.refresh());

			it("should delete an entity", async () => {
				// Backup previous data
				const { data: before } = await service.findAndCount();

				// Delete an entity
				const [workflow] = dbTest.db.workflows;
				const deleted = await service.delete(workflow._id);
				expect(deleted.toJSON!()).toStrictEqual(workflow);

				// Check that the entity is really deleted
				const { data: after } = await service.findAndCount();
				expect(after).toHaveLength(before.length - 1);
				expect(after.some(({ _id }) => _id === deleted._id)).toBeFalse();
			});

			it("should not delete an unknown id", async () => {
				const id = Math.max(...dbTest.db.workflows.map(({ _id }) => _id)) + 1;
				await expect(service.delete(id)).rejects.toThrow(NotFoundError);
			});
		});
	});
});
