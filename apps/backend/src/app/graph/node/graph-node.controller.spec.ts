import { Test, TestingModule } from "@nestjs/testing";

import { GraphNodeController } from "./graph-node.controller";
import { GraphNodeRepository } from "./graph-node.repository";
import { GraphNodeService } from "./graph-node.service";
import { GraphRepository } from "../graph.repository";
import { GraphService } from "../graph.service";

describe("GraphNodeController", () => {
	let controller: GraphNodeController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [GraphNodeController],
			providers: [
				{ provide: GraphRepository, useValue: {} },
				GraphService,
				{ provide: GraphNodeRepository, useValue: {} },
				GraphNodeService
			]
		}).compile();

		controller = module.get<GraphNodeController>(GraphNodeController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
