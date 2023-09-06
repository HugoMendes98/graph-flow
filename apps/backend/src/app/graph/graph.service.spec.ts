import { NotFoundError } from "@mikro-orm/core";
import { MethodNotAllowedException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { GraphModule } from "./graph.module";
import { GraphService } from "./graph.service";
import { DbTestHelper } from "../../../test/db-test";
import { OrmModule } from "../../orm/orm.module";

describe("GraphService", () => {
	let dbTest: DbTestHelper;
	let service: GraphService;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [OrmModule, GraphModule]
		}).compile();

		dbTest = new DbTestHelper(module);
		service = module.get(GraphService);
	});

	afterAll(() => dbTest.close());

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("CRUD basic", () => {
		let graphs: typeof dbTest.db.graph.graphs;

		beforeEach(() => {
			graphs = dbTest.db.graph.graphs;
		});

		describe("Read", () => {
			beforeEach(() => dbTest.refresh());

			it("should get one", async () => {
				for (const graph of graphs) {
					const row = await service.findById(graph._id);
					expect(row.toJSON()).toStrictEqual(graph);
				}
			});

			it("should fail when getting one by an unknown id", async () => {
				const id = Math.max(...graphs.map(({ _id }) => _id)) + 1;
				await expect(service.findById(id)).rejects.toThrow(NotFoundError);
			});
		});

		describe("Create", () => {
			it("should fail when creating a graph directly", async () => {
				await expect(() => service.create({})).rejects.toThrow(MethodNotAllowedException);
			});
		});

		describe("Delete", () => {
			it("should fail when deleting a graph directly", async () => {
				await expect(() => service.delete(graphs[0]._id)).rejects.toThrow(
					MethodNotAllowedException
				);
			});
		});
	});
});
