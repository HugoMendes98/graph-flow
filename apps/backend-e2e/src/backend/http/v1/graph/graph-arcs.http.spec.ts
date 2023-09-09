import { AxiosError, HttpStatusCode } from "axios";
import { Jsonify } from "type-fest";
import { DbE2eHelper } from "~/app/backend/e2e/db-e2e/db-e2e.helper";
import { GraphHttpClient } from "~/app/backend/e2e/http/clients";
import { GraphArcQueryDto } from "~/lib/common/app/graph/dtos/arc";
import { generateGraphArcsEndpoint } from "~/lib/common/app/graph/endpoints";
import { NodeKindType } from "~/lib/common/app/node/dtos/kind";
import { BASE_SEED } from "~/lib/common/seeds";

describe("Backend HTTP GraphArcs", () => {
	const graphClient = new GraphHttpClient();

	const dbHelper = DbE2eHelper.getHelper("base");
	const db = JSON.parse(JSON.stringify(dbHelper.db)) as Jsonify<typeof BASE_SEED>;

	const { arcs, graphs, nodes } = db.graph;
	const [graphRef] = graphs;
	const arcsRef = arcs.filter(({ __to }) =>
		nodes.some(
			({ inputs, kind }) =>
				kind.type === NodeKindType.EDGE &&
				kind.__graph === graphRef._id &&
				inputs.some(({ _id }) => _id === __to)
		)
	);

	const client = graphClient.forArcs(graphRef._id);

	beforeAll(async () => {
		const [{ email, password }] = db.users;

		await dbHelper.refresh();
		await client.setAuth(email, password);
	});

	describe(`GET ${generateGraphArcsEndpoint(graphRef._id)}`, () => {
		beforeAll(() => dbHelper.refresh());

		const sorted = arcsRef.slice().sort(({ _id: a }, { _id: b }) => a - b);

		it("should return 3 arcs", async () => {
			const limit = 3;
			const {
				data,
				pagination: { total }
			} = await client.findMany({
				params: { limit, order: [{ _id: "asc" }] } satisfies GraphArcQueryDto
			});

			expect(data).toHaveLength(limit);
			expect(total).toBe(arcsRef.length);

			expect(data).toStrictEqual(sorted.slice(0, limit));
		});
	});

	describe(`GET ${generateGraphArcsEndpoint(graphRef._id)}/:id`, () => {
		beforeAll(() => dbHelper.refresh());

		it("should get one", async () => {
			for (const arc of arcsRef) {
				const response = await client.findOne(arc._id);
				expect(response).toStrictEqual(arc);
			}
		});

		it("should fail when getting one by an unknown id", async () => {
			const id = Math.max(...arcs.map(({ _id }) => _id)) + 1;
			const response = await client
				.findOneResponse(id)
				.catch(({ response }: AxiosError) => response!);
			expect(response.status).toBe(HttpStatusCode.NotFound);
		});

		it("should fail when getting one from another graph", async () => {
			const refIds = arcsRef.map(({ _id }) => _id);

			const arc = arcs.find(({ _id }) => !refIds.includes(_id));
			expect(arc).toBeDefined();

			const response = await client
				.findOneResponse(arc!._id)
				.catch(({ response }: AxiosError) => response!);
			expect(response.status).toBe(HttpStatusCode.NotFound);
		});
	});

	describe(`PATCH ${generateGraphArcsEndpoint(graphRef._id)}/:id`, () => {
		it("should not allow to update an arc", async () => {
			const [arc] = arcsRef;
			const response = await client
				.updateResponse(arc._id, {})
				.catch(({ response }: AxiosError) => response!);
			expect(response.status).toBe(HttpStatusCode.MethodNotAllowed);
		});
	});
});
