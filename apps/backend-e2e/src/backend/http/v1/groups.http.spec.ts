import { AxiosError, HttpStatusCode } from "axios";
import { Jsonify } from "type-fest";
import { GroupHttpClient } from "~/app/backend/e2e/http/clients";
import { GroupCreateDto, GroupDto, GroupQueryDto, GroupUpdateDto } from "~/app/common/dtos/group";
import { GROUPS_ENDPOINT_PREFIX } from "~/app/common/endpoints";
import { EntityOrder } from "~/app/common/endpoints/_lib";

import { DbE2eHelper } from "../../../support/db-e2e/db-e2e.helper";

describe(`Backend HTTP ${GROUPS_ENDPOINT_PREFIX}`, () => {
	const client = new GroupHttpClient();

	const dbHelper = DbE2eHelper.getHelper("base");
	const db = JSON.parse(JSON.stringify(dbHelper.db)) as Jsonify<typeof dbHelper.db>;

	beforeEach(() => dbHelper.refresh());

	describe(`GET ${GROUPS_ENDPOINT_PREFIX}/:id`, () => {
		it("should get one", async () => {
			for (const group of db.groups) {
				const response = await client.findOne(group._id);
				expect(response).toStrictEqual(group);
			}
		});

		it("should fail when getting one by an unknown id", async () => {
			const id = Math.max(...db.groups.map(({ _id }) => _id)) + 1;
			const response = await client
				.findOneResponse(id)
				.catch(({ response }: AxiosError) => response!);
			expect(response.status).toBe(HttpStatusCode.NotFound);
		});
	});

	describe(`GET ${GROUPS_ENDPOINT_PREFIX}`, () => {
		const sorted = db.groups.slice().sort(({ _id: a }, { _id: b }) => a - b);

		describe("Counting", () => {
			it("should count only", async () => {
				const {
					data,
					pagination: { total }
				} = await client.findMany({ params: { limit: 0 } satisfies GroupQueryDto });

				expect(data).toHaveLength(0);
				expect(total).toBe(sorted.length);
			});

			it("should count with filters", async () => {
				const {
					pagination: { total }
				} = await client.findMany({
					params: {
						where: { _id: { $ne: sorted[0]._id } }
					} satisfies GroupQueryDto
				});
				expect(total).toBe(sorted.length - 1);
			});
		});

		describe("Pagination", () => {
			it("should paginate", async () => {
				const loop = Math.min(5, sorted.length);
				for (let skip = 0; skip < loop; ++skip) {
					const { pagination } = await client.findMany({
						params: { limit: 1, skip } satisfies GroupQueryDto
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
							} satisfies GroupQueryDto
						})
						.catch(({ response }: AxiosError) => response!);
					const response2 = await client
						.findManyResponse({
							params: {
								skip: value
							} satisfies GroupQueryDto
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
							} satisfies GroupQueryDto
						})
						.catch(({ response }: AxiosError) => response!);
					const response2 = await client
						.findManyResponse({
							params: {
								skip: value as unknown as number
							} satisfies GroupQueryDto
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
					params: { order: [{ _id: "asc" }] } satisfies GroupQueryDto
				});
				expect(ordered1).toStrictEqual(sorted);

				const { data: ordered2 } = await client.findMany({
					params: { order: [{ _id: "desc" }] } satisfies GroupQueryDto
				});
				expect(ordered2).toStrictEqual(sorted.slice().reverse());
			});

			it("should fail when the order is not an array", async () => {
				const order: EntityOrder<GroupDto> = { _id: "asc" };
				const response = await client
					.findManyResponse({
						params: { order: order as never } satisfies GroupQueryDto
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
					} satisfies GroupQueryDto
				});

				expect(actual).toStrictEqual(expected);
			});

			it("should filter with `$or`", async () => {
				const filterId = sorted[0]._id;
				const filterName = sorted[1]._name;

				const expected = sorted.filter(
					({ _id, _name }) => _id === filterId || _name === filterName
				);
				const { data: actual } = await client.findMany({
					params: {
						order: [{ _id: "asc" }],
						where: { $or: [{ _id: filterId }, { _name: filterName }] }
					} satisfies GroupQueryDto
				});

				expect(actual).toStrictEqual(expected);
			});

			it("should filter with relation", async () => {
				const [, user] = db.users;
				const expected = sorted.filter(({ __creator }) => __creator === user._id);
				const { data: actuel } = await client.findMany({
					params: {
						where: { creator: { email: user.email } }
					} satisfies GroupQueryDto
				});

				expect(actuel).toStrictEqual(expected);
			});
		});
	});

	describe(`POST ${GROUPS_ENDPOINT_PREFIX}`, () => {
		it("should add a new entity", async () => {
			const { data: before } = await client.findMany();

			// Create a new entity and check its content
			const toCreate: GroupCreateDto = { _name: "A whole new group" };
			const created = await client.create(toCreate);
			expect(created.__creator).toBeNull();
			expect(created._name).toBe(toCreate._name);

			// Check that the entity is in the data (should have one more than before)
			const { data: after } = await client.findMany();
			expect(after).toHaveLength(before.length + 1);

			// Check that the value returned in the list is equal to the one just created
			const found = after.find(({ _id }) => _id === created._id);
			expect(found).toBeDefined();
			expect(created).toStrictEqual(found);
		});

		it("should fail when a uniqueness constraint is not respected", async () => {
			const toCreate: GroupCreateDto = { _name: db.groups[0]._name };
			const response = await client
				.createResponse(toCreate)
				.catch(({ response }: AxiosError) => response!);
			expect(response.status).toBe(HttpStatusCode.Conflict);
		});

		// Use theses to test when the values are valid or not.
		// Use another to determine the correct error(s) returned.
		it("should fail with a BAD_REQUEST status code when the payload is invalid", async () => {
			for (const toCreate of [
				{ _name: "" },
				{ _name: "1" },
				{ __creator: 0, _name: "default-name" },
				{ __creator: -1, _name: "default-name" }
			] satisfies GroupCreateDto[]) {
				const response = await client
					.createResponse(toCreate)
					.catch(({ response }: AxiosError) => response!);
				expect(response.status).toBe(HttpStatusCode.BadRequest);
			}
		});

		it("should fail with a BAD_REQUEST status code when the payload is incorrectly typed", async () => {
			for (const toCreate of [
				{ _name: 123 as unknown as string },
				{ __creator: "abc" as unknown as number, _name: "default-name" }
			] satisfies GroupCreateDto[]) {
				const response = await client
					.createResponse(toCreate)
					.catch(({ response }: AxiosError) => response!);
				expect(response.status).toBe(HttpStatusCode.BadRequest);
			}
		});

		describe("Create with a user relation", () => {
			beforeEach(() => dbHelper.refresh());

			it("should create a group with a creator", async () => {
				const [user] = db.users;
				const toCreate: GroupCreateDto = {
					__creator: user._id,
					_name: "A whole new group"
				};
				const created = await client.create(toCreate);
				expect(created.__creator).toBe(user._id);
			});

			it("should fail when the creator id does not exist", async () => {
				const maxId = Math.max(...db.users.map(({ _id }) => _id)) + 1;
				const toCreate: GroupCreateDto = { __creator: maxId, _name: "A whole new group" };

				const response = await client
					.createResponse(toCreate)
					.catch(({ response }: AxiosError) => response!);
				expect(response.status).toBe(HttpStatusCode.NotFound);
			});
		});
	});

	describe(`PATCH ${GROUPS_ENDPOINT_PREFIX}/:id`, () => {
		it("should update an entity", async () => {
			const {
				pagination: { total: beforeTotal }
			} = await client.findMany();

			const [group] = db.groups;
			const toUpdate: GroupUpdateDto = { _name: `${group._name}-${group._name}` };
			const updated = await client.update(group._id, toUpdate);
			expect(updated._name).toBe(toUpdate._name);
			expect(updated._updated_at > group._updated_at).toBeTrue();

			const {
				data: after,
				pagination: { total: afterTotal }
			} = await client.findMany();
			expect(afterTotal).toBe(beforeTotal);

			const found = after.find(({ _id }) => _id === group._id);
			expect(found).toBeDefined();
			expect(updated).toStrictEqual(found);
		});

		it("should not update the date if there's no change", async () => {
			const [, group] = db.groups;
			const toUpdate: GroupUpdateDto = { _name: group._name };
			const updated = await client.update(group._id, toUpdate);
			expect(updated).toStrictEqual(group);
		});

		it("should fail when a uniqueness constraint is not respected", async () => {
			const [group1, group2] = db.groups;

			const toUpdate: GroupUpdateDto = { _name: group1._name };
			const response = await client
				.updateResponse(group2._id, toUpdate)
				.catch(({ response }: AxiosError) => response!);
			expect(response.status).toBe(HttpStatusCode.Conflict);
		});

		// Use theses to test when the values are valid or not.
		// Use another to determine the correct error(s) returned.
		it("should fail with a BAD_REQUEST status code when the payload is invalid", async () => {
			const [group] = db.groups;
			for (const toUpdate of [
				{ _name: "" },
				{ _name: "1" },
				{ __creator: 0 },
				{ __creator: -1 }
			] satisfies GroupUpdateDto[]) {
				const response = await client
					.updateResponse(group._id, toUpdate)
					.catch(({ response }: AxiosError) => response!);
				expect(response.status).toBe(HttpStatusCode.BadRequest);
			}
		});

		it("should fail with a BAD_REQUEST status code when the payload is incorrectly typed", async () => {
			const [group] = db.groups;
			for (const toUpdate of [
				{ _name: 123 as unknown as string },
				{ __creator: "abc" as unknown as number }
			] satisfies GroupUpdateDto[]) {
				const response = await client
					.updateResponse(group._id, toUpdate)
					.catch(({ response }: AxiosError) => response!);
				expect(response.status).toBe(HttpStatusCode.BadRequest);
			}
		});
	});

	describe(`DELETE ${GROUPS_ENDPOINT_PREFIX}`, () => {
		it("should delete an entity", async () => {
			const {
				pagination: { total: beforeTotal }
			} = await client.findMany();

			const [group] = db.groups;
			const deleted = await client.delete(group._id);
			expect(deleted).toStrictEqual(group);

			const {
				data: after,
				pagination: { total: afterTotal }
			} = await client.findMany();
			expect(afterTotal).toBe(beforeTotal - 1);
			expect(after.some(({ _id }) => _id === deleted._id)).toBeFalse();
		});

		it("should not delete an unknown id", async () => {
			const id = Math.max(...db.groups.map(({ _id }) => _id)) + 1;
			const response = await client
				.deleteResponse(id)
				.catch(({ response }: AxiosError) => response!);
			expect(response.status).toBe(HttpStatusCode.NotFound);
		});
	});
});
