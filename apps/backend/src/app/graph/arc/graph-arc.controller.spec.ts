import { Test, TestingModule } from "@nestjs/testing";

import { GraphArcController } from "./graph-arc.controller";
import { GraphArcRepository } from "./graph-arc.repository";
import { GraphArcService } from "./graph-arc.service";
import { GraphRepository } from "../graph.repository";
import { GraphService } from "../graph.service";

describe("GraphArcController", () => {
	let controller: GraphArcController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [GraphArcController],
			providers: [
				{ provide: GraphRepository, useValue: {} },
				GraphService,
				{ provide: GraphArcRepository, useValue: {} },
				GraphArcService
			]
		}).compile();

		controller = module.get<GraphArcController>(GraphArcController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
