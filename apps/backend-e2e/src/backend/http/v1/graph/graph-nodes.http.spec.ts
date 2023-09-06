import { AxiosError, HttpStatusCode } from "axios";
import { Jsonify } from "type-fest";
import { DbE2eHelper } from "~/app/backend/e2e/db-e2e/db-e2e.helper";
import { GraphHttpClient } from "~/app/backend/e2e/http/clients";
import { GraphNodeQueryDto } from "~/lib/common/app/graph/dtos/node";
import { generateGraphNodesEndpoint } from "~/lib/common/app/graph/endpoints";
import { omit } from "~/lib/common/utils/object-fns";

describe("Backend HTTP GraphNodes", () => {
	const graphClient = new GraphHttpClient();

	const dbHelper = DbE2eHelper.getHelper("base");
	const db = JSON.parse(JSON.stringify(dbHelper.db)) as Jsonify<typeof dbHelper.db>;

	const { graphNodes, graphs } = db.graph;
	const [graphRef] = graphs;
	const graphRefNodes = graphNodes.filter(({ __graph }) => __graph === graphRef._id);

	const client = graphClient.forNodes(graphRef._id);

	beforeAll(async () => {
		const [{ email, password }] = db.users;

		await dbHelper.refresh();
		await client.setAuth(email, password);
	});

	describe(`GET ${generateGraphNodesEndpoint(graphRef._id)}`, () => {
		beforeAll(() => dbHelper.refresh());
		const sorted = graphRefNodes.slice().sort(({ _id: a }, { _id: b }) => a - b);

		it("should return 3 nodes", async () => {
			const limit = 3;
			const {
				data,
				pagination: { total }
			} = await client.findMany({
				params: {
					limit,
					order: [{ _id: "asc" }]
				} satisfies GraphNodeQueryDto
			});

			expect(data).toHaveLength(limit);
			expect(total).toBe(sorted.length);

			expect(data.map(item => omit(item, ["inputs", "outputs"]))).toStrictEqual(
				sorted.slice(0, limit)
			);
		});
	});

	describe(`GET ${generateGraphNodesEndpoint(graphRef._id)}/:id`, () => {
		beforeAll(() => dbHelper.refresh());

		it("should get one", async () => {
			for (const node of graphRefNodes) {
				const response = await client.findOne(node._id);
				expect(omit(response, ["inputs", "outputs"])).toStrictEqual(node);
			}
		});

		it("should fail when getting one by an unknown id", async () => {
			const id = Math.max(...graphNodes.map(({ _id }) => _id)) + 1;
			const response = await client
				.findOneResponse(id)
				.catch(({ response }: AxiosError) => response!);
			expect(response.status).toBe(HttpStatusCode.NotFound);
		});

		it("should fail when getting one from another graph", async () => {
			const graphNode = graphNodes.find(({ __graph }) => __graph !== graphRef._id);
			expect(graphNode).toBeDefined();

			const response = await client
				.findOneResponse(graphNode!._id)
				.catch(({ response }: AxiosError) => response!);
			expect(response.status).toBe(HttpStatusCode.NotFound);
		});
	});
});
