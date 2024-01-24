import { AxiosError, HttpStatusCode } from "axios";
import { Jsonify } from "type-fest";
import { UserHttpClient } from "~/app/backend/e2e/http/clients";
import {
	UserDto,
	UserQueryDto,
	UserUpdateDto
} from "~/lib/common/app/user/dtos";
import { USERS_ENDPOINT_PREFIX } from "~/lib/common/app/user/endpoints";
import { EntityOrder } from "~/lib/common/endpoints";
import { omit } from "~/lib/common/utils/object-fns";

import { DbE2eHelper } from "../../../support/db-e2e/db-e2e.helper";

describe(`Backend HTTP ${USERS_ENDPOINT_PREFIX}`, () => {
	const client = new UserHttpClient();

	const dbHelper = DbE2eHelper.getHelper("base");
	const db = JSON.parse(JSON.stringify(dbHelper.db)) as Jsonify<
		typeof dbHelper.db
	>;
	const { users } = db;
	const [user] = users;

	beforeEach(async () => {
		const { email, password } = user;

		await dbHelper.refresh();
		await client.setAuth(email, password);
	});

	describe(`GET ${USERS_ENDPOINT_PREFIX}/:id`, () => {
		it("should get one", async () => {
			for (const user of db.users) {
				const response = await client.findOne(user._id);
				expect(response).toStrictEqual(omit(user, ["password"]));
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
				} = await client.findMany({
					params: { limit: 0 } satisfies UserQueryDto
				});

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
				expect(ordered1).toStrictEqual(
					sorted.map(user => omit(user, ["password"]))
				);

				const { data: ordered2 } = await client.findMany({
					params: { order: [{ _id: "desc" }] } satisfies UserQueryDto
				});
				expect(ordered2).toStrictEqual(
					sorted
						.slice()
						.reverse()
						.map(user => omit(user, ["password"]))
				);
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

				expect(actual).toStrictEqual(
					expected.map(user => omit(user, ["password"]))
				);
			});

			it("should filter with `$or`", async () => {
				const filterId = sorted[0]._id;
				const filterEmail = sorted[1].email;

				const expected = sorted.filter(
					({ _id, email }) =>
						_id === filterId || email === filterEmail
				);
				const { data: actual } = await client.findMany({
					params: {
						order: [{ _id: "asc" }],
						where: {
							$or: [{ _id: filterId }, { email: filterEmail }]
						}
					} satisfies UserQueryDto
				});

				expect(actual).toStrictEqual(
					expected.map(user => omit(user, ["password"]))
				);
			});
		});
	});

	describe(`PATCH ${USERS_ENDPOINT_PREFIX}/:id`, () => {
		it("should update an entity", async () => {
			const {
				pagination: { total: beforeTotal }
			} = await client.findMany();

			const toUpdate: UserUpdateDto = {
				firstname: `${user.firstname || "abc"}.123`
			};
			const updated = await client.update(user._id, toUpdate);
			expect(updated.firstname).toBe(toUpdate.firstname);
			expect(user._updated_at < updated._updated_at).toBe(true);

			const {
				data: after,
				pagination: { total: afterTotal }
			} = await client.findMany();
			expect(afterTotal).toBe(beforeTotal);

			const found = after.find(({ _id }) => _id === user._id);
			expect(found).toBeDefined();
			expect(updated).toStrictEqual(found);
		});

		it("should not be able to update a user's email", async () => {
			const toUpdate = { email: `abc.${user.email}` } satisfies Pick<
				UserDto,
				"email"
			>;
			const updated = await client.update(user._id, toUpdate);

			expect(updated.email).toBe(user.email);
			expect(updated.email).not.toBe(toUpdate.email);
		});

		it("should not be able to update another user (404)", async () => {
			const { _id } = users.find(({ _id }) => _id !== user._id)!;

			const response = await client
				.updateResponse(_id, {
					firstname: "abc123"
				} satisfies UserUpdateDto)
				.catch(({ response }: AxiosError) => response!);
			expect(response.status).toBe(404);
		});

		it("should not update the date if there's no change", async () => {
			const toUpdate: UserUpdateDto = { firstname: user.firstname };
			const updated = await client.update(user._id, toUpdate);
			expect(updated).toStrictEqual(omit(user, ["password"]));
		});
	});

	describe(`DELETE ${USERS_ENDPOINT_PREFIX}`, () => {
		it("should delete an entity", async () => {
			const {
				pagination: { total: beforeTotal }
			} = await client.findMany();

			const deleted = await client.delete(user._id);
			expect(deleted).toStrictEqual(omit(user, ["password"]));

			await client.setAuth(users[1].email, users[1].password);

			const {
				data: after,
				pagination: { total: afterTotal }
			} = await client.findMany();
			expect(afterTotal).toBe(beforeTotal - 1);
			expect(after.some(({ _id }) => _id === deleted._id)).toBe(false);
		});

		it("should not be able to delete another user (404)", async () => {
			const { _id } = users.find(({ _id }) => _id !== user._id)!;

			const response = await client
				.deleteResponse(_id)
				.catch(({ response }: AxiosError) => response!);
			expect(response.status).toBe(404);
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
