import { Test, TestingModule } from "@nestjs/testing";

import { GraphArcService } from "./graph-arc.service";
import { DbTestHelper } from "../../../../test/db-test";
import { OrmModule } from "../../../orm/orm.module";
import { GraphModule } from "../graph.module";

describe("GraphArcService", () => {
	let dbTest: DbTestHelper;
	let service: GraphArcService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [OrmModule, GraphModule]
		}).compile();

		dbTest = new DbTestHelper(module);
		service = module.get(GraphArcService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("CRUD basic", () => {
		it("should be done", () => {
			expect(false).toBeTrue();
		});
	});
});
