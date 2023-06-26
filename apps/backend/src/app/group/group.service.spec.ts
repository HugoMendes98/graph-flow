import { NotFoundError, UniqueConstraintViolationException } from "@mikro-orm/core";
import { Test, TestingModule } from "@nestjs/testing";
import { GroupCreateDto, GroupUpdateDto } from "~/app/common/dtos/group";

import { GroupModule } from "./group.module";
import { GroupService } from "./group.service";
import { DbTestHelper } from "../../../test/db-test";
import { OrmModule } from "../../orm/orm.module";

describe("GroupService", () => {
	let dbTest: DbTestHelper;
	let service: GroupService;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [OrmModule, GroupModule]
		}).compile();

		dbTest = new DbTestHelper(module);
		service = module.get(GroupService);
	});

	afterAll(() => dbTest.close());

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("CRUD base", () => {
		beforeEach(() => dbTest.refresh());

		describe("Read", () => {
			it("should get one", async () => {
				for (const group of dbTest.db.groups) {
					const row = await service.findById(group._id);
					expect(row.toJSON!()).toStrictEqual(group);
				}
			});

			it("should fail when getting one by an unknown id", async () => {
				const id = Math.max(...dbTest.db.groups.map(({ _id }) => _id)) + 1;
				await expect(service.findById(id)).rejects.toThrow(NotFoundError);
			});

			describe("Find many", () => {
				it("should return all", async () => {
					const { groups } = dbTest.db;
					const {
						data,
						pagination: { total }
					} = await service.findAndCount();

					expect(data).toHaveLength(total);
					expect(data).toHaveLength(groups.length);
					expect(data.map(d => d.toJSON!())).toStrictEqual(groups);
				});

				it("should count", async () => {
					const {
						groups: { length }
					} = dbTest.db;
					const count = await service.count();
					const {
						data,
						pagination: { total }
					} = await service.findAndCount({}, { limit: 0 });

					expect(count).toBe(length);
					expect(total).toBe(length);
					expect(data).toHaveLength(0);
				});

				it("should filter", async () => {
					const groups = dbTest.db.groups.slice(1);

					const {
						data,
						pagination: { total }
					} = await service.findAndCount({
						$or: groups.map(({ _name }) => ({ _name }))
					});

					expect(data).toHaveLength(total);
					expect(data).toHaveLength(groups.length);
					expect(data.map(d => d.toJSON!())).toStrictEqual(groups);
				});

				it("should paginate", async () => {
					const { groups } = dbTest.db;

					const loop = Math.min(5, groups.length);
					for (let skip = 0; skip < loop; ++skip) {
						const { pagination } = await service.findAndCount({}, { limit: 1, skip });

						expect(pagination.range.start).toBe(skip);
						expect(pagination.range.end).toBe(skip + 1);
						expect(pagination.total).toBe(groups.length);
					}
				});

				it("should order", async () => {
					const sorted = dbTest.db.groups.slice().sort(({ _id: a }, { _id: b }) => a - b);

					const { data: ordered1 } = await service.findAndCount(
						{},
						{ order: [{ _id: "asc" }] }
					);
					expect(ordered1.map(grp => grp.toJSON!())).toStrictEqual(sorted);

					// Create some data for testing
					const sample = [
						{ _name: "some-unique-name1", name: { en: "a", fr: "a" } },
						{ _name: "some-unique-name2", name: { en: "b", fr: "a" } },
						{ _name: "some-unique-name3", name: { fr: "b" } },
						{ _name: "some-unique-name4", name: { en: "b", fr: "b" } }
					] satisfies GroupCreateDto[];

					for (const toCreate of sample) {
						await service.create(toCreate);
					}

					const ids = sorted.map(({ _id }) => _id);
					const { data: ordered2 } = await service.findAndCount(
						// Do not keep data
						{ _id: { $gt: ids[ids.length - 1] } },
						{
							limit: sample.length,
							order: [
								{ name: { en: "asc_nf" } },
								{ name: { fr: "desc_nf" } },
								{ _id: "desc" }
							]
						}
					);

					// Small filter test
					expect(ordered2.some(({ _id }) => ids.includes(_id))).toBeFalse();

					expect(ordered2[0]._name).toBe(sample[2]._name);
					expect(ordered2[1]._name).toBe(sample[0]._name);
					expect(ordered2[2]._name).toBe(sample[3]._name);
					expect(ordered2[3]._name).toBe(sample[1]._name);

					// Only here
					await dbTest.refresh();
				});
			});
		});

		describe("Create", () => {
			beforeEach(() => dbTest.refresh());

			it("should add a new entity", async () => {
				// Backup previous data
				const { data: before } = await service.findAndCount();

				// Create a new entity and check its content
				const toCreate: GroupCreateDto = { _name: "A whole new group" };
				const created = await service.create(toCreate);
				expect(created.__creator).toBeNull();
				expect(created._name).toBe(toCreate._name);

				// Check that the entity is in the data (should have one more than before)
				const { data: after } = await service.findAndCount();
				expect(after).toHaveLength(before.length + 1);

				// Check that the value returned in the list is equal to the one just created
				const found = after.find(({ _id }) => _id === created._id);
				expect(found).toBeDefined();
				expect(created.toJSON!()).toStrictEqual(found!.toJSON!());
			});

			it("should fail when a uniqueness constraint is not respected", async () => {
				const toCreate: GroupCreateDto = { _name: dbTest.db.groups[0]._name };
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
				const [group] = dbTest.db.groups;
				const toUpdate: GroupUpdateDto = { _name: `${group._name}-${group._name}` };
				const updated = await service.update(group._id, toUpdate);
				expect(updated._name).toBe(toUpdate._name);

				// Check the data has still the same size
				const { data: after } = await service.findAndCount();
				expect(after).toHaveLength(before.length);

				// Check that the value returned in the list is equal to the one just updated
				const found = after.find(({ _id }) => _id === group._id);
				expect(found).toBeDefined();
				expect(updated.toJSON!()).toStrictEqual(found!.toJSON!());
			});

			it("should not update the date if there's no change", async () => {
				const [, group] = dbTest.db.groups;
				const toUpdate: GroupUpdateDto = { _name: group._name };
				const updated = await service.update(group._id, toUpdate);
				expect(updated.toJSON!()).toStrictEqual(group);
			});

			it("should fail when a uniqueness constraint is not respected", async () => {
				const [group1, group2] = dbTest.db.groups;

				const toUpdate: GroupUpdateDto = { _name: group1._name };
				await expect(service.update(group2._id, toUpdate)).rejects.toThrow(
					UniqueConstraintViolationException
				);
			});
		});

		describe("Delete", () => {
			it("should delete an entity", async () => {
				// Backup previous data
				const { data: before } = await service.findAndCount();

				// Delete an entity
				const [group] = dbTest.db.groups;
				const deleted = await service.delete(group._id);
				expect(deleted.toJSON!()).toStrictEqual(group);

				// Check that the entity is really deleted
				const { data: after } = await service.findAndCount();
				expect(after).toHaveLength(before.length - 1);
				expect(after.some(({ _id }) => _id === deleted._id)).toBeFalse();
			});

			it("should not delete an unknown id", async () => {
				const id = Math.max(...dbTest.db.groups.map(({ _id }) => _id)) + 1;
				await expect(service.delete(id)).rejects.toThrow(NotFoundError);
			});
		});
	});

	// More specific tests
});
