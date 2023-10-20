import { CronExpression } from "@nestjs/schedule";
import { Test, TestingModule } from "@nestjs/testing";
import * as fs from "fs";
import * as path from "path";
import { NodeBehaviorType } from "~/lib/common/app/node/dtos/behaviors/node-behavior.type";
import { NodeTriggerType } from "~/lib/common/app/node/dtos/behaviors/triggers";
import { NodeKindType } from "~/lib/common/app/node/dtos/kind/node-kind.type";
import { NodeIoType } from "~/lib/common/app/node/io";

import { WorkflowModule } from "./workflow.module";
import { WorkflowScheduler } from "./workflow.scheduler";
import { WorkflowService } from "./workflow.service";
import { DbTestHelper } from "../../../test/db-test";
import { getConfiguration } from "../../configuration";
import { OrmModule } from "../../orm/orm.module";
import { GraphArcService } from "../graph/arc/graph-arc.service";
import { GraphService } from "../graph/graph.service";
import { NodeInputService } from "../node/input/node-input.service";
import { NodeCreateEntity, NodeService } from "../node/node.service";

describe("WorkflowScheduler", () => {
	let dbTest: DbTestHelper;
	let scheduler: WorkflowScheduler;
	let service: WorkflowService;

	let graphService: GraphService;
	let graphArcService: GraphArcService;
	let nodeInputService: NodeInputService;
	let nodeService: NodeService;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [OrmModule, WorkflowModule]
		}).compile();

		dbTest = new DbTestHelper(module, { sample: "empty" });
		scheduler = module.get(WorkflowScheduler);
		service = module.get(WorkflowService);

		graphService = module.get(GraphService);
		graphArcService = module.get(GraphArcService);
		nodeInputService = module.get(NodeInputService);
		nodeService = module.get(NodeService);
	});

	beforeEach(() => dbTest.refresh());
	afterAll(() => dbTest.close());

	const getCode = () => {
		const { db } = getConfiguration();
		const rawContent = fs
			.readFileSync(path.resolve("libs/common/src/seeds/codes/create-graph.js"))
			.toString();

		const value = 1000 + Math.floor(10e5 * Math.random());
		const code = rawContent
			.replace("$[{_dbName}]", db.name)
			.replace("$[{_dbHost}]", db.host)
			.replace("$[{_dbPass}]", db.password)
			.replace('"$[{_dbPort}]"', db.port.toString())
			.replace("$[{_dbUser}]", db.username)
			.replace('"$[{_value}]"', value.toString());

		return { code, value };
	};

	const seed = async (cron: string) => {
		const codeContend = getCode();
		const { code } = codeContend;

		const { __graph, _id } = await service.create({ name: "workflow" });

		const kind: NodeCreateEntity["kind"] = {
			__graph,
			position: { x: 0, y: 0 },
			type: NodeKindType.VERTEX
		};
		const nodeTrigger = await nodeService.create({
			behavior: {
				trigger: { cron, type: NodeTriggerType.CRON },
				type: NodeBehaviorType.TRIGGER
			},
			kind,
			name: "trigger"
		});

		const nodeCode = await nodeService.create({
			behavior: { code, type: NodeBehaviorType.CODE },
			kind,
			name: "code"
		});
		const nodeCodeInput = await nodeInputService.createFromNode(nodeCode, {
			name: "",
			type: NodeIoType.VOID
		});
		await graphArcService.create({
			__from: nodeTrigger.outputs.getItems()[0]._id,
			__to: nodeCodeInput._id
		});

		return {
			code: codeContend,
			nodeCode,
			nodeTrigger,
			workflow: await service.findById(_id)
		};
	};

	it("should execute a scheduled workflow", async () => {
		const {
			code: { value },
			workflow
		} = await seed(CronExpression.EVERY_SECOND);

		const {
			pagination: { total: totalBefore }
		} = await graphService.findAndCount();

		// ----- Tests

		await scheduler.register(workflow);
		expect(scheduler.isRegistered(workflow)).toBeTrue();

		// The workflow could not be called when sleeping for 1 seconds or less
		// And it could be executed twice for more time

		// Polling to detect the new graph:
		await (async () => {
			const timeMax = 2000;
			const period = 200;

			for (let time = 0; time < timeMax; time += period) {
				await new Promise(resolve => setTimeout(resolve, period));

				const after = await graphService
					.findAndCount({}, { limit: 0 })
					.then(({ pagination: { total } }) => total);

				if (after !== totalBefore) {
					return Promise.resolve();
				}
			}

			throw new Error(`No new graph detected from the workflow in less than ${timeMax}ms.`);
		})();

		await scheduler.unregister(workflow);
		expect(scheduler.isRegistered(workflow)).toBeFalse();

		const {
			data: [graphTest],
			pagination: { total: totalAfter }
		} = await graphService.findAndCount({}, { limit: 1, order: [{ _id: "desc" }] });

		expect(totalAfter).toBe(totalBefore + 1);
		expect(graphTest._id).toBe(value);
	});

	it("should register and unregister by (de)activating a workflow", async () => {
		const { workflow } = await seed(CronExpression.EVERY_YEAR);

		expect(scheduler.isRegistered(workflow)).toBeFalse();

		await service.update(workflow._id, { active: true });
		expect(scheduler.isRegistered(workflow)).toBeTrue();

		await service.update(workflow._id, { active: false });
		expect(scheduler.isRegistered(workflow)).toBeFalse();
	});
});
