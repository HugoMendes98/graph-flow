import { Test, TestingModule } from "@nestjs/testing";

import { WorkflowModule } from "./workflow.module";
import { WorkflowService } from "./workflow.service";
import { DbTestHelper } from "../../../test/db-test";
import { OrmModule } from "../../orm/orm.module";

describe("WorkflowService", () => {
	let dbTest: DbTestHelper;
	let service: WorkflowService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [OrmModule, WorkflowModule]
		}).compile();

		dbTest = new DbTestHelper(module);
		service = module.get<WorkflowService>(WorkflowService);
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
