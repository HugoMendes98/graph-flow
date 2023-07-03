import { Test, TestingModule } from "@nestjs/testing";

import { CategoryModule } from "./category.module";
import { CategoryService } from "./category.service";
import { DbTestHelper } from "../../../test/db-test";
import { OrmModule } from "../../orm/orm.module";

describe("CategoryService", () => {
	let dbTest: DbTestHelper;
	let service: CategoryService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [OrmModule, CategoryModule]
		}).compile();

		dbTest = new DbTestHelper(module);
		service = module.get<CategoryService>(CategoryService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("CRUD basic", () => {
		it("should be done", () => {
			expect(false).toBeTrue();
		});
	});
});
