import { NotFoundError, UniqueConstraintViolationException } from "@mikro-orm/core";
import { MethodNotAllowedException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { GraphArcCreateDto } from "~/lib/common/dtos/graph/arc";

import { GraphArcService } from "./graph-arc.service";
import { DbTestHelper } from "../../../../test/db-test";
import { OrmModule } from "../../../orm/orm.module";
import { GraphModule } from "../graph.module";

describe("GraphArcService", () => {
	let dbTest: DbTestHelper;
	let service: GraphArcService;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [OrmModule, GraphModule],
			providers: []
		}).compile();

		dbTest = new DbTestHelper(module);
		service = module.get(GraphArcService);
	});

	afterAll(() => dbTest.close());

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("CRUD basic", () => {
		let graphArcs: typeof dbTest.db.graph.graphArcs;

		beforeEach(() => {
			graphArcs = dbTest.db.graph.graphArcs;
		});

		describe("Read", () => {
			beforeEach(() => dbTest.refresh());

			it("should get one", async () => {
				for (const arc of graphArcs) {
					const row = await service.findById(arc._id);
					expect(row.toJSON()).toStrictEqual(arc);
				}
			});

			it("should fail when getting one by an unknown id", async () => {
				const id = Math.max(...graphArcs.map(({ _id }) => _id)) + 1;
				await expect(service.findById(id)).rejects.toThrow(NotFoundError);
			});
		});

		describe("Create", () => {
			beforeEach(() => dbTest.refresh());

			it("should add a new entity", async () => {
				const { __from, __to } = await service.delete(graphArcs[0]._id);

				const { data: before } = await service.findAndCount();
				const toCreate: GraphArcCreateDto = { __from, __to };
				const created = await service.create(toCreate);
				expect(created.__from).toBe(toCreate.__from);
				expect(created.__to).toBe(toCreate.__to);

				// Check that the entity is in the data (should have one more than before)
				const { data: after } = await service.findAndCount();
				expect(after).toHaveLength(before.length + 1);

				// Check that the value returned in the list is equal to the one just created
				const found = after.find(({ _id }) => _id === created._id);
				expect(found).toBeDefined();
				expect(created.toJSON()).toStrictEqual(found!.toJSON());
			});

			it("should fail when a uniqueness constraint is not respected", async () => {
				const [{ __to }] = graphArcs;

				await expect(() => service.create({ __from: 123123, __to })).rejects.toThrow(
					UniqueConstraintViolationException
				);
			});
		});

		describe("Update", () => {
			it("should fail when updated a graph-arc", async () => {
				await expect(() => service.update(graphArcs[0]._id, {})).rejects.toThrow(
					MethodNotAllowedException
				);
			});
		});

		describe("Delete", () => {
			beforeEach(() => dbTest.refresh());

			it("should delete an entity", async () => {
				const [{ _id }] = graphArcs;
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
				const id = Math.max(...graphArcs.map(({ _id }) => _id)) + 1;
				await expect(service.delete(id)).rejects.toThrow(NotFoundError);
			});
		});
	});
});
