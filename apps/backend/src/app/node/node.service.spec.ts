import { Test, TestingModule } from "@nestjs/testing";

import { NodeModule } from "./node.module";
import { NodeService } from "./node.service";
import { DbTestHelper } from "../../../test/db-test";
import { OrmModule } from "../../orm/orm.module";

describe("NodeService", () => {
	let dbTest: DbTestHelper;
	let service: NodeService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [OrmModule, NodeModule]
		}).compile();

		dbTest = new DbTestHelper(module);
		service = module.get<NodeService>(NodeService);
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
