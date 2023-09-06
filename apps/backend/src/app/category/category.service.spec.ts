import { NotFoundError, UniqueConstraintViolationException } from "@mikro-orm/core";
import { Test, TestingModule } from "@nestjs/testing";
import { CategoryCreateDto, CategoryUpdateDto } from "~/lib/common/app/category/dtos";

import { CategoryModule } from "./category.module";
import { CategoryService } from "./category.service";
import { DbTestHelper } from "../../../test/db-test";
import { OrmModule } from "../../orm/orm.module";

describe("CategoryService", () => {
	let dbTest: DbTestHelper;
	let service: CategoryService;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [OrmModule, CategoryModule]
		}).compile();

		dbTest = new DbTestHelper(module);
		service = module.get<CategoryService>(CategoryService);
	});

	afterAll(() => dbTest.close());

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("CRUD basic", () => {
		describe("Read", () => {
			beforeEach(() => dbTest.refresh());

			it("should get one", async () => {
				for (const category of dbTest.db.categories) {
					const row = await service.findById(category._id);
					expect(row.toJSON()).toStrictEqual(category);
				}
			});

			it("should fail when getting one by an unknown id", async () => {
				const id = Math.max(...dbTest.db.categories.map(({ _id }) => _id)) + 1;
				await expect(service.findById(id)).rejects.toThrow(NotFoundError);
			});
		});

		describe("Create", () => {
			beforeEach(() => dbTest.refresh());

			it("should add a new entity", async () => {
				// Backup previous data
				const { data: before } = await service.findAndCount();

				// Create a new entity and check its content
				const toCreate: CategoryCreateDto = { name: "a new category" };
				const created = await service.create(toCreate);
				expect(created.name).toBe(toCreate.name);

				// Check that the entity is in the data (should have one more than before)
				const { data: after } = await service.findAndCount();
				expect(after).toHaveLength(before.length + 1);

				// Check that the value returned in the list is equal to the one just created
				const found = after.find(({ _id }) => _id === created._id);
				expect(found).toBeDefined();
				expect(created.toJSON()).toStrictEqual(found!.toJSON());
			});

			it("should fail when a uniqueness constraint is not respected", async () => {
				const toCreate: CategoryCreateDto = { name: dbTest.db.categories[0].name };
				await expect(service.create(toCreate)).rejects.toThrow(
					UniqueConstraintViolationException
				);
			});
		});

		describe("Update", () => {
			beforeEach(() => dbTest.refresh());

			it("should update an entity", async () => {
				// Backup previous data
				const { data: before } = await service.findAndCount();

				// Update an entity and check its content
				const [category] = dbTest.db.categories;
				const toUpdate: CategoryUpdateDto = { name: `${category.name}-${category.name}` };
				const updated = await service.update(category._id, toUpdate);
				expect(updated.name).toBe(toUpdate.name);

				// Check the data has still the same size
				const { data: after } = await service.findAndCount();
				expect(after).toHaveLength(before.length);

				// Check that the value returned in the list is equal to the one just updated
				const found = after.find(({ _id }) => _id === category._id);
				expect(found).toBeDefined();
				expect(updated.toJSON()).toStrictEqual(found!.toJSON());
			});

			it("should not update the date if there's no change", async () => {
				const [, category] = dbTest.db.categories;
				const toUpdate: CategoryUpdateDto = { name: category.name };
				const updated = await service.update(category._id, toUpdate);
				expect(updated.toJSON()).toStrictEqual(category);
			});

			it("should fail when a uniqueness constraint is not respected", async () => {
				const [category1, category2] = dbTest.db.categories;

				const toUpdate: CategoryUpdateDto = { name: category1.name };
				await expect(service.update(category2._id, toUpdate)).rejects.toThrow(
					UniqueConstraintViolationException
				);
			});
		});

		describe("Delete", () => {
			beforeEach(() => dbTest.refresh());

			it("should delete an entity", async () => {
				// Backup previous data
				const { data: before } = await service.findAndCount();

				// Delete an entity
				const [category] = dbTest.db.categories;
				const deleted = await service.delete(category._id);
				expect(deleted.toJSON!()).toStrictEqual(category);

				// Check that the entity is really deleted
				const { data: after } = await service.findAndCount();
				expect(after).toHaveLength(before.length - 1);
				expect(after.some(({ _id }) => _id === deleted._id)).toBeFalse();
			});

			it("should not delete an unknown id", async () => {
				const id = Math.max(...dbTest.db.categories.map(({ _id }) => _id)) + 1;
				await expect(service.delete(id)).rejects.toThrow(NotFoundError);
			});
		});
	});
});
