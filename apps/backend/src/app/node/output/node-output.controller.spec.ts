import { Test, TestingModule } from "@nestjs/testing";

import { NodeOutputController } from "./node-output.controller";
import { OrmModule } from "../../../orm/orm.module";
import { NodeModule } from "../node.module";

describe("NodeOutputController", () => {
	let controller: NodeOutputController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [NodeModule, OrmModule]
		}).compile();

		controller = module.get<NodeOutputController>(NodeOutputController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
