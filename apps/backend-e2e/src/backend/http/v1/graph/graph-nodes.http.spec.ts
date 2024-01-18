import { AxiosError, HttpStatusCode } from "axios";
import { Jsonify } from "type-fest";
import { DbE2eHelper } from "~/app/backend/e2e/db-e2e/db-e2e.helper";
import { GraphHttpClient } from "~/app/backend/e2e/http/clients";
import { GraphNodeKindUpdateDto } from "~/lib/common/app/graph/dtos/node";
import { generateGraphNodesEndpoint } from "~/lib/common/app/graph/endpoints";
import { NodeQueryDto, NodeUpdateDto } from "~/lib/common/app/node/dtos";
import { NodeKindType } from "~/lib/common/app/node/dtos/kind/node-kind.type";
import { omit } from "~/lib/common/utils/object-fns";

describe("Backend HTTP GraphNodes", () => {
	const graphClient = new GraphHttpClient();

	const dbHelper = DbE2eHelper.getHelper("base");
	const db = JSON.parse(JSON.stringify(dbHelper.db)) as Jsonify<
		typeof dbHelper.db
	>;

	const { graphs, nodes } = db.graph;
	const [graphRef] = graphs;
	const nodesRef = nodes
		.filter(
			({ kind }) =>
				kind.type === NodeKindType.VERTEX &&
				kind.__graph === graphRef._id
		)
		.map(node => omit(node, ["__categories"]));

	const client = graphClient.forNodes(graphRef._id);

	beforeAll(async () => {
		const [{ email, password }] = db.users;

		await dbHelper.refresh();
		await client.setAuth(email, password);
	});

	describe(`GET ${generateGraphNodesEndpoint(graphRef._id)}`, () => {
		beforeAll(() => dbHelper.refresh());
		const sorted = nodesRef.slice().sort(({ _id: a }, { _id: b }) => a - b);

		it("should return 3 nodes", async () => {
			const limit = 3;
			const {
				data,
				pagination: { total }
			} = await client.findMany({
				params: {
					limit,
					order: [{ _id: "asc" }]
				} satisfies NodeQueryDto
			});

			expect(data).toHaveLength(limit);
			expect(total).toBe(sorted.length);

			expect(data).toStrictEqual(sorted.slice(0, limit));
		});
	});

	describe(`GET ${generateGraphNodesEndpoint(graphRef._id)}/:id`, () => {
		beforeAll(() => dbHelper.refresh());

		it("should get one", async () => {
			for (const node of nodesRef) {
				const data = await client.findOne(node._id);
				expect(data).toStrictEqual(node);
			}
		});

		it("should fail when getting one by an unknown id", async () => {
			const id = Math.max(...nodes.map(({ _id }) => _id)) + 1;
			const response = await client
				.findOneResponse(id)
				.catch(({ response }: AxiosError) => response!);
			expect(response.status).toBe(HttpStatusCode.NotFound);
		});

		it("should fail when getting one from another graph", async () => {
			const node = nodes.find(
				({ kind }) =>
					kind.type === NodeKindType.VERTEX &&
					kind.__graph !== graphRef._id
			);
			expect(node).toBeDefined();

			const response = await client
				.findOneResponse(node!._id)
				.catch(({ response }: AxiosError) => response!);
			expect(response.status).toBe(HttpStatusCode.NotFound);
		});
	});

	describe(`PATCH ${generateGraphNodesEndpoint(graphRef._id)}/:id`, () => {
		it("should update the position of a node", async () => {
			const {
				data: [node]
			} = await client.findMany({
				params: { limit: 1 } satisfies NodeQueryDto
			});

			const position = {
				x: node.kind.position.x * 2,
				y: node.kind.position.y + 2
			} as const satisfies GraphNodeKindUpdateDto["position"];

			const updated = await client.update(node._id, {
				kind: { position, type: NodeKindType.VERTEX }
			} satisfies NodeUpdateDto);

			expect(updated.kind.position.x).toBe(position.x);
			expect(updated.kind.position.y).toBe(position.y);
		});
	});
});
