import { Test, TestingModule } from "@nestjs/testing";

import { NodeInputController } from "./node-input.controller";
import { OrmModule } from "../../../orm/orm.module";
import { NodeModule } from "../node.module";

describe("NodeInputController", () => {
	let controller: NodeInputController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [NodeModule, OrmModule]
		}).compile();

		controller = module.get<NodeInputController>(NodeInputController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
