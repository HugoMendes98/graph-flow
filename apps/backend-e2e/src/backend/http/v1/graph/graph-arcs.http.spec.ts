import { AxiosError, HttpStatusCode } from "axios";
import { Jsonify } from "type-fest";
import { DbE2eHelper } from "~/app/backend/e2e/db-e2e/db-e2e.helper";
import { GraphHttpClient } from "~/app/backend/e2e/http/clients";
import { GraphArcQueryDto } from "~/lib/common/dtos/graph/arc";
import { generateGraphArcsEndpoint } from "~/lib/common/endpoints/gaph";

describe("Backend HTTP GraphArcs", () => {
	const graphClient = new GraphHttpClient();

	const dbHelper = DbE2eHelper.getHelper("base");
	const db = JSON.parse(JSON.stringify(dbHelper.db)) as Jsonify<typeof dbHelper.db>;

	const { graphArcs, graphNodeInputs, graphNodes, graphs } = db.graph;
	const [graphRef] = graphs;
	const graphRefArcs = graphArcs.filter(({ __to }) => {
		const input = graphNodeInputs.find(input => input._id === __to);
		if (!input) {
			return false;
		}

		return graphNodes.find(node => node._id === input.__graph_node)?.__graph === graphRef._id;
	});

	const client = graphClient.forArcs(graphRef._id);

	describe(`GET ${generateGraphArcsEndpoint(graphRef._id)}`, () => {
		beforeAll(() => dbHelper.refresh());

		const sorted = graphRefArcs.slice().sort(({ _id: a }, { _id: b }) => a - b);

		it("should return 3 arcs", async () => {
			const limit = 3;
			const {
				data,
				pagination: { total }
			} = await client.findMany({
				params: { limit, order: [{ _id: "asc" }] } satisfies GraphArcQueryDto
			});

			expect(data).toHaveLength(limit);
			expect(total).toBe(graphRefArcs.length);

			expect(data).toStrictEqual(sorted.slice(0, limit));
		});
	});

	describe(`GET ${generateGraphArcsEndpoint(graphRef._id)}/:id`, () => {
		beforeAll(() => dbHelper.refresh());

		it("should get one", async () => {
			for (const arc of graphRefArcs) {
				const response = await client.findOne(arc._id);
				expect(response).toStrictEqual(arc);
			}
		});

		it("should fail when getting one by an unknown id", async () => {
			const id = Math.max(...graphArcs.map(({ _id }) => _id)) + 1;
			const response = await client
				.findOneResponse(id)
				.catch(({ response }: AxiosError) => response!);
			expect(response.status).toBe(HttpStatusCode.NotFound);
		});

		it("should fail when getting one from another graph", async () => {
			const refIds = graphRefArcs.map(({ _id }) => _id);

			const graphArc = graphArcs.find(({ _id }) => !refIds.includes(_id));
			expect(graphArc).toBeDefined();

			const response = await client
				.findOneResponse(graphArc!._id)
				.catch(({ response }: AxiosError) => response!);
			expect(response.status).toBe(HttpStatusCode.NotFound);
		});
	});

	describe(`PATCH ${generateGraphArcsEndpoint(graphRef._id)}/:id`, () => {
		it("should not allow to update an arc", async () => {
			const [arc] = graphRefArcs;
			const response = await client
				.updateResponse(arc._id, {})
				.catch(({ response }: AxiosError) => response!);
			expect(response.status).toBe(HttpStatusCode.MethodNotAllowed);
		});
	});
});
