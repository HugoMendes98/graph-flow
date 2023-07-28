import { Test, TestingModule } from "@nestjs/testing";

import { GraphController } from "./graph.controller";
import { GraphRepository } from "./graph.repository";
import { GraphService } from "./graph.service";

describe("GraphController", () => {
	let controller: GraphController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [GraphController],
			providers: [{ provide: GraphRepository, useValue: {} }, GraphService]
		}).compile();

		controller = module.get<GraphController>(GraphController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
