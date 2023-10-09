import { Test } from "@nestjs/testing";
import { lastValueFrom, toArray } from "rxjs";
import { NodeBehaviorType } from "~/lib/common/app/node/dtos/behaviors/node-behavior.type";
import { NodeKindType } from "~/lib/common/app/node/dtos/kind/node-kind.type";
import { BASE_SEED } from "~/lib/common/seeds";

import { GraphExecutorStartingNodeException } from "./exceptions";
import { GraphExecutor } from "./graph.executor";
import { DbTestHelper } from "../../../../test/db-test";
import { OrmModule } from "../../../orm/orm.module";
import { NodeBehaviorFunction } from "../../node/behaviors";
import { NodeModule } from "../../node/node.module";
import { NodeService } from "../../node/node.service";
import { GraphModule } from "../graph.module";

describe("GraphExecutor", () => {
	let db: typeof BASE_SEED;
	let dbTest: DbTestHelper;
	let executor: GraphExecutor;
	let nodeService: NodeService;

	beforeAll(async () => {
		const module = await Test.createTestingModule({
			imports: [OrmModule, GraphModule, NodeModule]
		}).compile();

		// FIXME
		await module.init();

		dbTest = new DbTestHelper(module);
		executor = module.get(GraphExecutor);
		nodeService = module.get(NodeService);

		db = dbTest.db as never;
		await dbTest.refresh();
	});

	afterAll(() => dbTest.close());

	// eslint-disable-next-line jest/expect-expect -- TODO
	it.skip("should execute a graph for a workflow", () => void 0);

	it("should execute a graph for a `node-function` ('Integer division')", async () => {
		const [graph] = db.graph.graphs;
		const { data: nodes } = await nodeService.findByGraph(graph._id);

		const node = await nodeService.findById(db.graph.nodes[7]._id);
		expect(node.behavior.type).toBe(NodeBehaviorType.FUNCTION);
		expect((node.behavior as NodeBehaviorFunction).__graph).toBe(graph._id);

		const state$ = await executor.execute({
			graphId: graph._id,
			inputs: new Map([
				[node.inputs[0]._id, 10],
				[node.inputs[1]._id, 3]
			]),
			startAt: nodes
				.filter(({ behavior: { type } }) => type === NodeBehaviorType.PARAMETER_IN)
				.map(({ _id }) => _id)
		});

		const states = await lastValueFrom(state$.pipe(toArray()));

		expect(states).toHaveLength(nodes.length * 2);
		for (const { _id } of nodes) {
			// Each node is called 2 times
			expect(states.filter(({ node }) => node._id === _id)).toHaveLength(2);
		}
	});

	it("should not execute unconnected nodes", async () => {
		const [graph] = db.graph.graphs;
		const { data: parameters } = await nodeService.findByGraph(graph._id, {
			behavior: { type: NodeBehaviorType.PARAMETER_IN }
		});

		const node = await nodeService.findById(db.graph.nodes[7]._id);
		expect(node.behavior.type).toBe(NodeBehaviorType.FUNCTION);
		expect((node.behavior as NodeBehaviorFunction).__graph).toBe(graph._id);

		const nodeUnconnected = await nodeService.create({
			behavior: { type: NodeBehaviorType.VARIABLE, value: 0 },
			kind: { __graph: graph._id, position: { x: 0, y: 0 }, type: NodeKindType.VERTEX },
			name: "unconnected"
		});

		const state$ = await executor.execute({
			graphId: graph._id,
			inputs: new Map([
				[node.inputs[0]._id, 10],
				[node.inputs[1]._id, 3]
			]),
			startAt: parameters.map(({ _id }) => _id)
		});

		const states = await lastValueFrom(state$.pipe(toArray()));
		expect(states.some(({ node }) => node._id === nodeUnconnected._id)).toBeFalse();
	});

	describe("Errors", () => {
		it("should thrown an error when there is no starting node", async () => {
			const [graph] = db.graph.graphs;

			await expect(() =>
				executor.execute({
					graphId: graph._id,
					inputs: new Map(),
					startAt: []
				})
			).rejects.toThrow(GraphExecutorStartingNodeException);
		});

		it("should thrown an error when the starting node are wrongly set", async () => {
			const [graph] = db.graph.graphs;

			await expect(() =>
				executor.execute({
					graphId: graph._id,
					inputs: new Map(),
					startAt: [1, 2]
				})
			).rejects.toThrow(GraphExecutorStartingNodeException);
		});
	});
});
