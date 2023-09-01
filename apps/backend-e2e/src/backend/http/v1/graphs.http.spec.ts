import { AxiosError, HttpStatusCode } from "axios";
import { Jsonify } from "type-fest";
import { DbE2eHelper } from "~/app/backend/e2e/db-e2e/db-e2e.helper";
import { GraphHttpClient } from "~/app/backend/e2e/http/clients";
import { GraphQueryDto } from "~/lib/common/app/graph/dtos";
import { GRAPHS_ENDPOINT_PREFIX } from "~/lib/common/app/graph/endpoints";
import { BASE_SEED } from "~/lib/common/seeds";

describe("Backend HTTP Graphs", () => {
	const client = new GraphHttpClient();

	const dbHelper = DbE2eHelper.getHelper("base");
	const db = JSON.parse(JSON.stringify(dbHelper.db)) as Jsonify<typeof BASE_SEED>;

	const { graphs } = db.graph;

	beforeAll(async () => {
		const [{ email, password }] = db.users;

		await dbHelper.refresh();
		await client.setAuth(email, password);
	});

	describe(`GET ${GRAPHS_ENDPOINT_PREFIX}`, () => {
		beforeAll(() => dbHelper.refresh());

		const sorted = graphs.slice().sort(({ _id: a }, { _id: b }) => a - b);

		it("should return 2 graphs", async () => {
			const limit = 2;
			const {
				data,
				pagination: { total }
			} = await client.findMany({
				params: { limit, order: [{ _id: "asc" }] } satisfies GraphQueryDto
			});

			expect(data).toHaveLength(limit);
			expect(total).toBe(sorted.length);

			expect(data).toStrictEqual(sorted.slice(0, limit));
		});
	});

	describe(`GET ${GRAPHS_ENDPOINT_PREFIX}/:id`, () => {
		beforeAll(() => dbHelper.refresh());

		it("should get one", async () => {
			for (const graph of graphs) {
				const response = await client.findOne(graph._id);
				expect(response).toStrictEqual(graph);
			}
		});

		it("should fail when getting one by an unknown id", async () => {
			const id = Math.max(...graphs.map(({ _id }) => _id)) + 1;
			const response = await client
				.findOneResponse(id)
				.catch(({ response }: AxiosError) => response!);
			expect(response.status).toBe(HttpStatusCode.NotFound);
		});
	});

	describe(`POST ${GRAPHS_ENDPOINT_PREFIX}`, () => {
		it("should not allow to update a graph", async () => {
			const response = await client
				.createResponse({})
				.catch(({ response }: AxiosError) => response!);
			expect(response.status).toBe(HttpStatusCode.MethodNotAllowed);
		});
	});

	describe(`DELETE ${GRAPHS_ENDPOINT_PREFIX}/:id`, () => {
		it("should not allow to delete a graph", async () => {
			const response = await client
				.deleteResponse(graphs[0]._id)
				.catch(({ response }: AxiosError) => response!);
			expect(response.status).toBe(HttpStatusCode.MethodNotAllowed);
		});
	});
});
