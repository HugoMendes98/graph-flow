import { Test, TestingModule } from "@nestjs/testing";

import { GraphNodeController } from "./graph-node.controller";
import { OrmModule } from "../../../orm/orm.module";
import { GraphModule } from "../graph.module";

describe("GraphNodeController", () => {
	let controller: GraphNodeController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [OrmModule, GraphModule]
		}).compile();

		controller = module.get<GraphNodeController>(GraphNodeController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
