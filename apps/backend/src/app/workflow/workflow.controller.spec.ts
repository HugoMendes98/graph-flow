import { Test, TestingModule } from "@nestjs/testing";

import { WorkflowController } from "./workflow.controller";
import { WorkflowRepository } from "./workflow.repository";
import { WorkflowService } from "./workflow.service";
import { GraphRepository } from "../graph/graph.repository";
import { GraphService } from "../graph/graph.service";

describe("WorkflowController", () => {
	let controller: WorkflowController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [WorkflowController],
			providers: [
				{ provide: WorkflowRepository, useValue: {} },
				WorkflowService,
				{ provide: GraphRepository, useValue: {} },
				GraphService
			]
		}).compile();

		controller = module.get<WorkflowController>(WorkflowController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
