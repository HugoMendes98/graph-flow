import { DbE2eHelper } from "~/app/backend/e2e/db-e2e/db-e2e.helper";
import { NodeHttpClient } from "~/app/backend/e2e/http/clients/node.http-client";
import { NodeCreateDto, NodeQueryDto, NodeUpdateDto } from "~/lib/common/app/node/dtos";
import { NodeBehaviorType } from "~/lib/common/app/node/dtos/behaviors/node-behavior.type";
import { NodeKindEdgeDto } from "~/lib/common/app/node/dtos/kind";
import { NodeKindType } from "~/lib/common/app/node/dtos/kind/node-kind.type";
import { BASE_SEED } from "~/lib/common/seeds";
import { jsonify } from "~/lib/common/utils/jsonify";

describe("Backend HTTP Nodes", () => {
	const client = new NodeHttpClient();

	const dbHelper = DbE2eHelper.getHelper("base");
	const db = jsonify(BASE_SEED);

	beforeAll(async () => {
		const [{ email, password }] = db.users;

		await dbHelper.refresh();
		await client.setAuth(email, password);
	});

	describe("GET", () => {
		it("should filter by kind type", async () => {
			const type = NodeKindType.TEMPLATE;
			const expected = db.graph.nodes.filter(({ kind }) => kind.type === type);

			const { data, pagination } = await client.findMany({
				params: { where: { kind: { type } } } satisfies NodeQueryDto
			});
			expect(pagination.total).toBe(expected.length);

			const expectedIds = expected.map(({ _id }) => _id).sort();
			const dataIds = data.map(({ _id }) => _id).sort();

			expect(dataIds).toStrictEqual(expectedIds);
		});

		it("should filter by boolean property", async () => {
			const type = NodeKindType.TEMPLATE;
			const expected = db.graph.nodes.filter(({ kind }) => kind.type === type && kind.active);

			const { data } = await client.findMany({
				params: {
					where: { kind: { active: { $ne: false }, type } }
				} satisfies NodeQueryDto
			});
			expect(data).toHaveLength(expected.length);

			const expectedIds = expected.map(({ _id }) => _id).sort();
			const dataIds = data.map(({ _id }) => _id).sort();
			expect(dataIds).toStrictEqual(expectedIds);
		});
	});

	describe("POST", () => {
		beforeEach(() => dbHelper.refresh());

		it("should create a node (different `kinds`)", async () => {
			for (const toCreate of [
				{
					behavior: { type: NodeBehaviorType.VARIABLE, value: 1 },
					kind: { __graph: 1, position: { x: 0, y: 0 }, type: NodeKindType.EDGE },
					name: "-new node1"
				},
				{
					behavior: { type: NodeBehaviorType.VARIABLE, value: 1 },
					kind: { active: false, type: NodeKindType.TEMPLATE },
					name: "-new node2"
				}
			] satisfies NodeCreateDto[]) {
				const { behavior, kind, name } = await client.create(toCreate);

				expect(name).toBe(toCreate.name);
				expect(behavior).toStrictEqual(toCreate.behavior);
				expect(kind).toStrictEqual(toCreate.kind);
			}
		});
	});

	describe("PATCH", () => {
		beforeEach(() => dbHelper.refresh());

		it("should update a node (kind = edge)", async () => {
			const node = db.graph.nodes[0];

			const toUpdate = {
				kind: { position: { x: 250, y: 250 }, type: NodeKindType.EDGE }
			} as const satisfies NodeUpdateDto;
			const updated = await client.update(node._id, toUpdate);

			const { position } = updated.kind as NodeKindEdgeDto;
			expect(position.x).toBe(toUpdate.kind.position.x);
			expect(position.y).toBe(toUpdate.kind.position.y);
		});
	});
});
