import { Test, TestingModule } from "@nestjs/testing";

import { GraphNodeService } from "./graph-node.service";
import { DbTestHelper } from "../../../../test/db-test";
import { OrmModule } from "../../../orm/orm.module";
import { GraphModule } from "../graph.module";

describe("GraphNodeService", () => {
	let dbTest: DbTestHelper;
	let service: GraphNodeService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [OrmModule, GraphModule]
		}).compile();

		dbTest = new DbTestHelper(module);
		service = module.get(GraphNodeService);
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
