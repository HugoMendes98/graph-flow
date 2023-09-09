import { Test } from "@nestjs/testing";
import { NodeBehaviorType } from "~/lib/common/app/node/dtos/behaviors";
import { NodeTriggerType } from "~/lib/common/app/node/dtos/behaviors/triggers";
import { EntityId } from "~/lib/common/dtos/entity";
import { BASE_SEED } from "~/lib/common/seeds";

import {
	GraphExecutorMissingInputException,
	GraphExecutorNotExecutableException
} from "./exceptions";
import { GraphNodeExecutor } from "./graph-node.executor";
import { DbTestHelper } from "../../../../test/db-test";
import { OrmModule } from "../../../orm/orm.module";
import { NodeBehaviorTrigger } from "../../node/behaviors/node-behavior.trigger";
import { NodeBehaviorVariable } from "../../node/behaviors/parameters";
import { GraphModule } from "../graph.module";
import { GraphNodeService } from "../node/graph-node.service";

describe("GraphNodeExecutor", () => {
	let db: typeof BASE_SEED;
	let dbTest: DbTestHelper;
	let executor: GraphNodeExecutor;
	let service: GraphNodeService;

	beforeAll(async () => {
		const module = await Test.createTestingModule({
			imports: [OrmModule, GraphModule]
		}).compile();

		dbTest = new DbTestHelper(module);
		executor = module.get(GraphNodeExecutor);
		service = module.get(GraphNodeService);

		db = dbTest.db as never;
		await dbTest.refresh();
	});

	afterAll(() => dbTest.close());

	const getGNodeFromNode = (id: EntityId) =>
		service.findAndCount({ __node: id }).then(({ data: [node] }) => node);

	describe("Errors", () => {
		it("should fail when missing inputs", async () => {
			// Division
			const node = await getGNodeFromNode(db.node.nodes[5]._id);
			expect(node.node.behavior.type).toBe(NodeBehaviorType.CODE);
			await expect(() => executor.execute({ node, valuedInputs: new Map() })).rejects.toThrow(
				GraphExecutorMissingInputException
			);
		});

		it("should not execute a `node-parameter-in`", async () => {
			for (const { _id } of [db.node.nodes[8], db.node.nodes[9]]) {
				const node = await getGNodeFromNode(_id);
				expect(node.node.behavior.type).toBe(NodeBehaviorType.PARAMETER_IN);

				await expect(() =>
					executor.execute({ node, valuedInputs: new Map([]) })
				).rejects.toThrow(GraphExecutorNotExecutableException);
			}
		});

		it("should not execute a `node-parameter-out`", async () => {
			for (const { _id } of [db.node.nodes[10], db.node.nodes[11]]) {
				const node = await getGNodeFromNode(_id);
				expect(node.node.behavior.type).toBe(NodeBehaviorType.PARAMETER_OUT);

				await expect(() =>
					executor.execute({ node, valuedInputs: new Map([]) })
				).rejects.toThrow(GraphExecutorNotExecutableException);
			}
		});
	});

	it("should execute a `node-code` ('Calculate quotient' & 'Calculate remainder')", async () => {
		const [codeQuotient, codeRemainder] = await Promise.all([
			getGNodeFromNode(db.node.nodes[5]._id),
			getGNodeFromNode(db.node.nodes[6]._id)
		]);

		expect(codeQuotient.node.behavior.type).toBe(NodeBehaviorType.CODE);
		expect(codeRemainder.node.behavior.type).toBe(NodeBehaviorType.CODE);

		// The inputs for the nodes
		const {
			inputs: [qDividend, qDivisor],
			outputs: [codeQuotientOutput]
		} = codeQuotient;
		const {
			inputs: [rDividend, rDivisor],
			outputs: [codeRemainderOutput]
		} = codeRemainder;

		for (const [dividend, divisor] of [
			[10, 2],
			[9, 4],
			[123, 11],
			[93, 5],
			[12, 0]
		] satisfies Array<[number, number]>) {
			const quotientOutputs = await executor.execute({
				node: codeQuotient,
				valuedInputs: new Map([
					[qDividend._id, dividend],
					[qDivisor._id, divisor]
				])
			});
			const remainderOutputs = await executor.execute({
				node: codeRemainder,
				valuedInputs: new Map([
					[rDividend._id, dividend],
					[rDivisor._id, divisor]
				])
			});

			expect(quotientOutputs).toHaveLength(1);
			expect(remainderOutputs).toHaveLength(1);

			const [{ output: quotientOutput, value: quotient }] = quotientOutputs;
			const [{ output: remainderOutput, value: remainder }] = remainderOutputs;

			// The values are correct
			expect(quotient).toBe(divisor === 0 ? 0 : Math.floor(dividend / divisor));
			expect(remainder).toBe(divisor === 0 ? dividend : dividend % divisor);

			// The outputs of the nodes are correct
			expect(quotientOutput).toStrictEqual(codeQuotientOutput);
			expect(remainderOutput).toStrictEqual(codeRemainderOutput);
		}
	});

	it("should execute a `node-function` ('Integer division')", async () => {
		const fnDivision = await service.create({
			__graph: 1,
			__node: db.node.nodes[7]._id,
			position: { x: 0, y: 0 }
		});

		expect(fnDivision.node.behavior.type).toBe(NodeBehaviorType.FUNCTION);

		const {
			inputs: [fnDividend, fnDivisor],
			outputs: [fnQuotient, fnRemainder]
		} = fnDivision;

		for (const [dividend, divisor] of [
			[10, 2],
			[9, 4],
			[123, 11],
			[93, 5],
			[12, 0]
		] satisfies Array<[number, number]>) {
			const outputs = await executor.execute({
				node: fnDivision,
				valuedInputs: new Map([
					[fnDividend._id, dividend],
					[fnDivisor._id, divisor]
				])
			});
			expect(outputs).toHaveLength(2);

			const [
				{ value: quotient, ...quotientOutput },
				{ value: remainder, ...remainderOutput }
			] = outputs;

			// The values are correct
			expect(quotient).toBe(divisor === 0 ? 0 : Math.floor(dividend / divisor));
			expect(remainder).toBe(dividend % divisor);

			// The outputs of the nodes are correct
			expect(quotientOutput).toStrictEqual(fnQuotient);
			expect(remainderOutput).toStrictEqual(fnRemainder);
		}

		await dbTest.refresh();
	});

	describe("Triggers", () => {
		it("should execute a `node-trigger` (CRON)", async () => {
			const gNode = await getGNodeFromNode(db.node.nodes[12]._id);
			expect(gNode.node.behavior.type).toBe(NodeBehaviorType.TRIGGER);
			expect((gNode.node.behavior as NodeBehaviorTrigger).trigger.type).toBe(
				NodeTriggerType.CRON
			);

			const now = new Date().getTime();
			const outputs = await executor.execute({ node: gNode, valuedInputs: new Map() });
			expect(outputs).toHaveLength(1);

			const [{ output, value }] = outputs;
			expect(value).toBeGreaterThanOrEqual(now);
			expect(value).toBeLessThanOrEqual(now + 20);

			expect(output).toStrictEqual(gNode.outputs[0]);
		});
	});

	it("should execute a `node-variable`", async () => {
		for (const { _id } of db.node.nodes.slice(0, 4)) {
			const gNode = await getGNodeFromNode(_id);
			expect(gNode.node.behavior.type).toBe(NodeBehaviorType.VARIABLE);

			const outputValues = await executor.execute({ node: gNode, valuedInputs: new Map() });
			expect(outputValues).toHaveLength(1);

			const [{ output: outputValue, value }] = outputValues;

			expect(value).toBe((gNode.node.behavior as NodeBehaviorVariable).value);
			expect(outputValue).toStrictEqual(gNode.outputs[0]);
		}
	});
});
