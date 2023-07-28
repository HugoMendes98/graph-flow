import { NotFoundError, UniqueConstraintViolationException } from "@mikro-orm/core";
import { Test, TestingModule } from "@nestjs/testing";
import { UserCreateDto, UserUpdateDto } from "~/lib/common/dtos/user";

import { UserModule } from "./user.module";
import { UserService } from "./user.service";
import { DbTestHelper } from "../../../test/db-test";
import { OrmModule } from "../../orm/orm.module";

describe("UserService", () => {
	let dbTest: DbTestHelper;
	let service: UserService;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [OrmModule, UserModule]
		}).compile();

		dbTest = new DbTestHelper(module);
		service = module.get(UserService);
	});

	afterAll(() => dbTest.close());

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("CRUD Basic", () => {
		beforeEach(() => dbTest.refresh());

		describe("Read", () => {
			it("should get one", async () => {
				for (const user of dbTest.db.users) {
					const row = await service.findById(user._id);
					expect(row.toJSON()).toStrictEqual(user);
				}
			});

			it("should fail when getting one by an unknown id", async () => {
				const id = Math.max(...dbTest.db.users.map(({ _id }) => _id)) + 1;
				await expect(service.findById(id)).rejects.toThrow(NotFoundError);
			});

			describe("Find many", () => {
				it("should return all", async () => {
					const { users } = dbTest.db;
					const {
						data,
						pagination: { total }
					} = await service.findAndCount();

					expect(data).toHaveLength(total);
					expect(data).toHaveLength(users.length);
					expect(data.map(d => d.toJSON())).toStrictEqual(users);
				});

				it("should count", async () => {
					const {
						users: { length }
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

				it("should paginate", async () => {
					const { users } = dbTest.db;

					const loop = Math.min(5, users.length);
					for (let skip = 0; skip < loop; ++skip) {
						const { pagination } = await service.findAndCount({}, { limit: 1, skip });

						expect(pagination.range.start).toBe(skip);
						expect(pagination.range.end).toBe(skip + 1);
						expect(pagination.total).toBe(users.length);
					}
				});

				it("should filter", async () => {
					const users = dbTest.db.users.slice(1);

					const {
						data,
						pagination: { total }
					} = await service.findAndCount({
						$or: users.map(({ email }) => ({ email }))
					});

					expect(data).toHaveLength(total);
					expect(data).toHaveLength(users.length);
					expect(data.map(d => d.toJSON())).toStrictEqual(users);
				});
			});
		});

		describe("Create", () => {
			beforeEach(() => dbTest.refresh());

			it("should add a new entity", async () => {
				// Backup previous data
				const { data: before } = await service.findAndCount();

				// Create a new entity and check its content
				const toCreate: UserCreateDto = { email: "a whole new email" };
				const created = await service.create(toCreate);
				expect(created.email).toBe(toCreate.email);
				expect(created.firstname).toBeNull();

				// Check that the entity is in the data (should have one more than before)
				const { data: after } = await service.findAndCount();
				expect(after).toHaveLength(before.length + 1);

				// Check that the value returned in the list is equal to the one just created
				const found = after.find(({ _id }) => _id === created._id);
				expect(found).toBeDefined();
				expect(created.toJSON()).toStrictEqual(found!.toJSON());
			});

			it("should fail when a uniqueness constraint is not respected", async () => {
				const toCreate: UserCreateDto = { email: dbTest.db.users[0].email };
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
				const [user] = dbTest.db.users;
				const toUpdate: UserUpdateDto = { email: `${user.email}-${user.email}` };
				const updated = await service.update(user._id, toUpdate);
				expect(updated.email).toBe(toUpdate.email);

				// Check the data has still the same size
				const { data: after } = await service.findAndCount();
				expect(after).toHaveLength(before.length);

				// Check that the value returned in the list is equal to the one just updated
				const found = after.find(({ _id }) => _id === user._id);
				expect(found).toBeDefined();
				expect(updated.toJSON()).toStrictEqual(found!.toJSON());
			});

			it("should not update the date if there's no change", async () => {
				const [, user] = dbTest.db.users;
				const toUpdate: UserUpdateDto = { email: user.email };
				const updated = await service.update(user._id, toUpdate);
				expect(updated.toJSON()).toStrictEqual(user);
			});

			it("should fail when a uniqueness constraint is not respected", async () => {
				const [user1, user2] = dbTest.db.users;

				const toUpdate: UserUpdateDto = { email: user1.email };
				await expect(service.update(user2._id, toUpdate)).rejects.toThrow(
					UniqueConstraintViolationException
				);
			});
		});

		describe("Delete", () => {
			it("should delete an entity", async () => {
				// Backup previous data
				const { data: before } = await service.findAndCount();

				// Delete an entity
				const [user] = dbTest.db.users;
				const deleted = await service.delete(user._id);
				expect(deleted.toJSON!()).toStrictEqual(user);

				// Check that the entity is really deleted
				const { data: after } = await service.findAndCount();
				expect(after).toHaveLength(before.length - 1);
				expect(after.some(({ _id }) => _id === deleted._id)).toBeFalse();
			});

			it("should not delete an unknown id", async () => {
				const id = Math.max(...dbTest.db.users.map(({ _id }) => _id)) + 1;
				await expect(service.delete(id)).rejects.toThrow(NotFoundError);
			});
		});
	});
});
