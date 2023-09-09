import { Test, TestingModule } from "@nestjs/testing";

import { NodeController } from "./node.controller";
import { NodeModule } from "./node.module";
import { OrmModule } from "../../orm/orm.module";

describe("NodeController", () => {
	let controller: NodeController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [OrmModule, NodeModule]
		}).compile();

		controller = module.get<NodeController>(NodeController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
