import { Test, TestingModule } from "@nestjs/testing";

import { GraphModule } from "./graph.module";
import { GraphService } from "./graph.service";
import { DbTestHelper } from "../../../test/db-test";
import { OrmModule } from "../../orm/orm.module";

describe("GraphService", () => {
	let dbTest: DbTestHelper;
	let service: GraphService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [OrmModule, GraphModule]
		}).compile();

		dbTest = new DbTestHelper(module);
		service = module.get(GraphService);
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
