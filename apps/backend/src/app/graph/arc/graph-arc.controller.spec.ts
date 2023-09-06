import { Test, TestingModule } from "@nestjs/testing";

import { GraphArcController } from "./graph-arc.controller";
import { OrmModule } from "../../../orm/orm.module";
import { GraphModule } from "../graph.module";

describe("GraphArcController", () => {
	let controller: GraphArcController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [GraphModule, OrmModule]
		}).compile();

		controller = module.get<GraphArcController>(GraphArcController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
