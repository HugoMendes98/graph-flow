import { Test, TestingModule } from "@nestjs/testing";

import { CategoryController } from "./category.controller";
import { CategoryRepository } from "./category.repository";
import { CategoryService } from "./category.service";

describe("CategoryController", () => {
	let controller: CategoryController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [CategoryController],
			providers: [{ provide: CategoryRepository, useValue: {} }, CategoryService]
		}).compile();

		controller = module.get<CategoryController>(CategoryController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
