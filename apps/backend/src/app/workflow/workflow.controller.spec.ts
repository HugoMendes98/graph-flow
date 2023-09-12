import { Test, TestingModule } from "@nestjs/testing";

import { WorkflowController } from "./workflow.controller";
import { WorkflowModule } from "./workflow.module";
import { OrmModule } from "../../orm/orm.module";

describe("WorkflowController", () => {
	let controller: WorkflowController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [OrmModule, WorkflowModule]
		}).compile();

		controller = module.get<WorkflowController>(WorkflowController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
