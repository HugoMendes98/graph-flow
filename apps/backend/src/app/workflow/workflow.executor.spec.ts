import { Test, TestingModule } from "@nestjs/testing";
import { filter, lastValueFrom, tap } from "rxjs";
import { NodeBehaviorType } from "~/lib/common/app/node/dtos/behaviors/node-behavior.type";
import { NodeTriggerType } from "~/lib/common/app/node/dtos/behaviors/triggers";
import { NodeKindType } from "~/lib/common/app/node/dtos/kind/node-kind.type";
import { NodeIoType } from "~/lib/common/app/node/io";

import { WorkflowExecutor } from "./workflow.executor";
import { WorkflowModule } from "./workflow.module";
import { WorkflowService } from "./workflow.service";
import { DbTestHelper } from "../../../test/db-test";
import { OrmModule } from "../../orm/orm.module";
import { GraphArcService } from "../graph/arc/graph-arc.service";
import {
	GraphExecuteResolutionEndState,
	GraphExecuteStateType
} from "../graph/executor/graph.executor.state";
import { NodeInputService } from "../node/input/node-input.service";
import { NodeCreateEntity, NodeService } from "../node/node.service";

describe("WorkflowExecutor", () => {
	let dbTest: DbTestHelper;
	let executor: WorkflowExecutor;
	let service: WorkflowService;

	let graphArcService: GraphArcService;
	let nodeInputService: NodeInputService;
	let nodeService: NodeService;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [OrmModule, WorkflowModule]
		}).compile();

		dbTest = new DbTestHelper(module, { sample: "empty" });
		executor = module.get(WorkflowExecutor);
		service = module.get(WorkflowService);

		graphArcService = module.get(GraphArcService);
		nodeInputService = module.get(NodeInputService);
		nodeService = module.get(NodeService);
	});

	afterAll(() => dbTest.close());

	it("should execute a workflow and received the time of execution", async () => {
		await dbTest.refresh();

		const { __graph, _id } = await service.create({ name: "workflow" });
		const random = Math.ceil(100 * Math.random());

		const kind: NodeCreateEntity["kind"] = {
			__graph,
			position: { x: 0, y: 0 },
			type: NodeKindType.VERTEX
		};
		const nodeTrigger = await nodeService.create({
			behavior: {
				trigger: { cron: "* * * * *", type: NodeTriggerType.CRON },
				type: NodeBehaviorType.TRIGGER
			},
			kind,
			name: "trigger"
		});

		const nodeCode = await nodeService.create({
			behavior: {
				code: `module.export = time => \`${random}-\${time}\``,
				type: NodeBehaviorType.CODE
			},
			kind,
			name: "code"
		});

		const nodeCodeInput = await nodeInputService.createFromNode(nodeCode, {
			name: "",
			type: NodeIoType.NUMBER
		});
		const [nodeCodeOutput] = nodeCode.outputs.getItems();
		await graphArcService.create({
			__from: nodeTrigger.outputs.getItems()[0]._id,
			__to: nodeCodeInput._id
		});

		const beforeExecutionTime = new Date().getTime();
		const state$ = await service.findById(_id).then(w => executor.execute(w));
		const trace: Record<GraphExecuteStateType, number[]> = {
			"propagation-enter": [],
			"propagation-leave": [],
			"resolution-end": [],
			"resolution-start": []
		};

		// --- Test execution states

		const finalState = await lastValueFrom(
			state$.pipe(
				tap(state => trace[state.type].push(state.node._id)),
				filter(
					(state): state is GraphExecuteResolutionEndState =>
						state.type === "resolution-end"
				)
			)
		);

		expect(trace["resolution-start"]).toHaveLength(2);
		expect(trace["resolution-end"]).toHaveLength(2);

		const expected = [nodeTrigger._id, nodeCode._id].sort();
		expect(trace["resolution-start"].slice().sort()).toStrictEqual(expected);
		expect(trace["resolution-end"].slice().sort()).toStrictEqual(expected);

		// --- Test executed value

		const finalOutput = finalState.outputs.find(
			output => output.output._id === nodeCodeOutput._id
		)!;
		expect(finalOutput).toBeDefined();

		const finalValue = finalOutput.value as string;
		const [value, time] = finalValue.split("-").map(v => +v);
		expect(value).toBe(random);

		// 100ms
		expect(time).toBeGreaterThanOrEqual(beforeExecutionTime);
		expect(time).toBeLessThanOrEqual(beforeExecutionTime + 100);
	});
});
