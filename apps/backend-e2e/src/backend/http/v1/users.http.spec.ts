import { AxiosError, HttpStatusCode } from "axios";
import { Jsonify } from "type-fest";
import { UserHttpClient } from "~/app/backend/e2e/http/clients";
import { UserCreateDto, UserDto, UserQueryDto, UserUpdateDto } from "~/lib/common/app/user/dtos";
import { USERS_ENDPOINT_PREFIX } from "~/lib/common/app/user/endpoints";
import { EntityOrder } from "~/lib/common/endpoints";

import { DbE2eHelper } from "../../../support/db-e2e/db-e2e.helper";

describe(`Backend HTTP ${USERS_ENDPOINT_PREFIX}`, () => {
	const client = new UserHttpClient();

	const dbHelper = DbE2eHelper.getHelper("base");
	const db = JSON.parse(JSON.stringify(dbHelper.db)) as Jsonify<typeof dbHelper.db>;

	beforeEach(() => dbHelper.refresh());

	describe(`GET ${USERS_ENDPOINT_PREFIX}/:id`, () => {
		it("should get one", async () => {
			for (const user of db.users) {
				const response = await client.findOne(user._id);
				expect(response).toStrictEqual(user);
			}
		});

		it("should fail when getting one by an unknown id", async () => {
			const id = Math.max(...db.users.map(({ _id }) => _id)) + 1;
			const response = await client
				.findOneResponse(id)
				.catch(({ response }: AxiosError) => response!);
			expect(response.status).toBe(HttpStatusCode.NotFound);
		});
	});

	describe(`GET ${USERS_ENDPOINT_PREFIX}`, () => {
		const sorted = db.users.slice().sort(({ _id: a }, { _id: b }) => a - b);

		describe("Counting", () => {
			it("should count only", async () => {
				const {
					data,
					pagination: { total }
				} = await client.findMany({ params: { limit: 0 } satisfies UserQueryDto });

				expect(data).toHaveLength(0);
				expect(total).toBe(sorted.length);
			});

			it("should count with filters", async () => {
				const {
					pagination: { total }
				} = await client.findMany({
					params: {
						where: { _id: { $ne: sorted[0]._id } }
					} satisfies UserQueryDto
				});
				expect(total).toBe(sorted.length - 1);
			});
		});

		describe("Pagination", () => {
			it("should paginate", async () => {
				const loop = Math.min(5, sorted.length);
				for (let skip = 0; skip < loop; ++skip) {
					const { pagination } = await client.findMany({
						params: { limit: 1, skip } satisfies UserQueryDto
					});

					expect(pagination.range.start).toBe(skip);
					expect(pagination.range.end).toBe(skip + 1);
					expect(pagination.total).toBe(sorted.length);
				}
			});

			it("should fail when a value is wrong", async () => {
				for (const value of [-1, -10, -1000]) {
					const response1 = await client
						.findManyResponse({
							params: {
								limit: value
							} satisfies UserQueryDto
						})
						.catch(({ response }: AxiosError) => response!);
					const response2 = await client
						.findManyResponse({
							params: {
								skip: value
							} satisfies UserQueryDto
						})
						.catch(({ response }: AxiosError) => response!);

					expect(response1.status).toBe(HttpStatusCode.BadRequest);
					expect(response2.status).toBe(HttpStatusCode.BadRequest);
				}
			});

			it("should fail when the type is wrong", async () => {
				for (const value of ["a", [1], { limit: 1 }, new Date()]) {
					const response1 = await client
						.findManyResponse({
							params: {
								skip: value as unknown as number
							} satisfies UserQueryDto
						})
						.catch(({ response }: AxiosError) => response!);
					const response2 = await client
						.findManyResponse({
							params: {
								skip: value as unknown as number
							} satisfies UserQueryDto
						})
						.catch(({ response }: AxiosError) => response!);

					expect(response1.status).toBe(HttpStatusCode.BadRequest);
					expect(response2.status).toBe(HttpStatusCode.BadRequest);
				}
			});
		});

		describe("Ordering", () => {
			it("should order (simple)", async () => {
				const { data: ordered1 } = await client.findMany({
					params: { order: [{ _id: "asc" }] } satisfies UserQueryDto
				});
				expect(ordered1).toStrictEqual(sorted);

				const { data: ordered2 } = await client.findMany({
					params: { order: [{ _id: "desc" }] } satisfies UserQueryDto
				});
				expect(ordered2).toStrictEqual(sorted.slice().reverse());
			});

			it("should fail when the order is not an array", async () => {
				const order: EntityOrder<UserDto> = { _id: "asc" };
				const response = await client
					.findManyResponse({
						params: { order: order as never } satisfies UserQueryDto
					})
					.catch(({ response }: AxiosError) => response!);

				expect(response.status).toBe(HttpStatusCode.BadRequest);
			});
		});

		describe("Filtering", () => {
			it("should filter (simple)", async () => {
				const expected = sorted.filter((_, i) => i !== 1);
				const { data: actual } = await client.findMany({
					params: {
						order: [{ _id: "asc" }],
						where: { _id: { $in: expected.map(({ _id }) => _id) } }
					} satisfies UserQueryDto
				});

				expect(actual).toStrictEqual(expected);
			});

			it("should filter with `$or`", async () => {
				const filterId = sorted[0]._id;
				const filterEmail = sorted[1].email;

				const expected = sorted.filter(
					({ _id, email }) => _id === filterId || email === filterEmail
				);
				const { data: actual } = await client.findMany({
					params: {
						order: [{ _id: "asc" }],
						where: { $or: [{ _id: filterId }, { email: filterEmail }] }
					} satisfies UserQueryDto
				});

				expect(actual).toStrictEqual(expected);
			});
		});
	});

	describe(`POST ${USERS_ENDPOINT_PREFIX}`, () => {
		it("should add a new entity", async () => {
			const { data: before } = await client.findMany();

			// Create a new entity and check its content
			const toCreate: UserCreateDto = { email: "new.user@local.host" };
			const created = await client.create(toCreate);
			expect(created.firstname).toBeNull();
			expect(created.email).toBe(toCreate.email);

			// Check that the entity is in the data (should have one more than before)
			const { data: after } = await client.findMany();
			expect(after).toHaveLength(before.length + 1);

			// Check that the value returned in the list is equal to the one just created
			const found = after.find(({ _id }) => _id === created._id);
			expect(found).toBeDefined();
			expect(created).toStrictEqual(found);
		});

		it("should fail when a uniqueness constraint is not respected", async () => {
			const toCreate: UserCreateDto = { email: db.users[0].email };
			const response = await client
				.createResponse(toCreate)
				.catch(({ response }: AxiosError) => response!);
			expect(response.status).toBe(HttpStatusCode.Conflict);
		});

		// Use theses to test when the values are valid or not.
		// Use another to determine the correct error(s) returned.
		it("should fail with a BAD_REQUEST status code when the payload is invalid", async () => {
			for (const toCreate of [
				{ email: "" },
				{ email: "not an email" }
			] satisfies UserCreateDto[]) {
				const response = await client
					.createResponse(toCreate)
					.catch(({ response }: AxiosError) => response!);
				expect(response.status).toBe(HttpStatusCode.BadRequest);
			}
		});

		it("should fail with a BAD_REQUEST status code when the payload is incorrectly typed", async () => {
			for (const toCreate of [
				{ email: 123 as unknown as string },
				{ email: "a.valid@mail.local", lastname: 2 as unknown as string }
			] satisfies UserCreateDto[]) {
				const response = await client
					.createResponse(toCreate)
					.catch(({ response }: AxiosError) => response!);
				expect(response.status).toBe(HttpStatusCode.BadRequest);
			}
		});
	});

	describe(`PATCH ${USERS_ENDPOINT_PREFIX}/:id`, () => {
		it("should update an entity", async () => {
			const {
				pagination: { total: beforeTotal }
			} = await client.findMany();

			const [user] = db.users;
			const toUpdate: UserUpdateDto = { email: `${user.email}.mail` };
			const updated = await client.update(user._id, toUpdate);
			expect(updated.email).toBe(toUpdate.email);
			expect(updated._updated_at > user._updated_at).toBeTrue();

			const {
				data: after,
				pagination: { total: afterTotal }
			} = await client.findMany();
			expect(afterTotal).toBe(beforeTotal);

			const found = after.find(({ _id }) => _id === user._id);
			expect(found).toBeDefined();
			expect(updated).toStrictEqual(found);
		});

		it("should not update the date if there's no change", async () => {
			const [, user] = db.users;
			const toUpdate: UserUpdateDto = { email: user.email };
			const updated = await client.update(user._id, toUpdate);
			expect(updated).toStrictEqual(user);
		});

		it("should fail when a uniqueness constraint is not respected", async () => {
			const [user1, user2] = db.users;

			const toUpdate: UserUpdateDto = { email: user1.email };
			const response = await client
				.updateResponse(user2._id, toUpdate)
				.catch(({ response }: AxiosError) => response!);
			expect(response.status).toBe(HttpStatusCode.Conflict);
		});

		// Use theses to test when the values are valid or not.
		// Use another to determine the correct error(s) returned.
		it("should fail with a BAD_REQUEST status code when the payload is invalid", async () => {
			const [user] = db.users;
			for (const toUpdate of [
				{ email: "" },
				{ email: "not an email" }
			] satisfies UserUpdateDto[]) {
				const response = await client
					.updateResponse(user._id, toUpdate)
					.catch(({ response }: AxiosError) => response!);
				expect(response.status).toBe(HttpStatusCode.BadRequest);
			}
		});

		it("should fail with a BAD_REQUEST status code when the payload is incorrectly typed", async () => {
			const [user] = db.users;
			for (const toUpdate of [
				{ email: 123 as unknown as string }
			] satisfies UserUpdateDto[]) {
				const response = await client
					.updateResponse(user._id, toUpdate)
					.catch(({ response }: AxiosError) => response!);
				expect(response.status).toBe(HttpStatusCode.BadRequest);
			}
		});
	});

	describe(`DELETE ${USERS_ENDPOINT_PREFIX}`, () => {
		it("should delete an entity", async () => {
			const {
				pagination: { total: beforeTotal }
			} = await client.findMany();

			const [user] = db.users;
			const deleted = await client.delete(user._id);
			expect(deleted).toStrictEqual(user);

			const {
				data: after,
				pagination: { total: afterTotal }
			} = await client.findMany();
			expect(afterTotal).toBe(beforeTotal - 1);
			expect(after.some(({ _id }) => _id === deleted._id)).toBeFalse();
		});

		it("should not delete an unknown id", async () => {
			const id = Math.max(...db.users.map(({ _id }) => _id)) + 1;
			const response = await client
				.deleteResponse(id)
				.catch(({ response }: AxiosError) => response!);
			expect(response.status).toBe(HttpStatusCode.NotFound);
		});
	});
});
