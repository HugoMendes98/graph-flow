import { Test } from "@nestjs/testing";
import { NodeBehaviorType } from "~/lib/common/app/node/dtos/behaviors/node-behavior.type";
import { NodeTriggerType } from "~/lib/common/app/node/dtos/behaviors/triggers";
import { NodeKindType } from "~/lib/common/app/node/dtos/kind/node-kind.type";
import { BASE_SEED } from "~/lib/common/seeds";

import { NodeExecutorMissingInputException } from "./exceptions";
import { NodeExecutor } from "./node.executor";
import { DbTestHelper } from "../../../../test/db-test";
import { OrmModule } from "../../../orm/orm.module";
import { GraphModule } from "../../graph/graph.module";
import { NodeBehaviorTrigger } from "../behaviors/node-behavior.trigger";
import {
	NodeBehaviorParameterInput,
	NodeBehaviorParameterOutput,
	NodeBehaviorVariable
} from "../behaviors/parameters";
import { NodeModule } from "../node.module";
import { NodeService } from "../node.service";

describe("NodeExecutor", () => {
	let db: typeof BASE_SEED;
	let dbTest: DbTestHelper;
	let executor: NodeExecutor;
	let service: NodeService;

	beforeAll(async () => {
		const module = await Test.createTestingModule({
			imports: [OrmModule, NodeModule, GraphModule]
		}).compile();

		// FIXME
		await module.init();

		dbTest = new DbTestHelper(module);
		executor = module.get(NodeExecutor);
		service = module.get(NodeService);

		db = dbTest.db as never;
		await dbTest.refresh();
	});

	afterAll(() => dbTest.close());

	describe("Errors", () => {
		it("should fail when missing inputs", async () => {
			// Division
			const node = await service.findById(db.graph.nodes[5]._id);
			expect(node.behavior.type).toBe(NodeBehaviorType.CODE);
			await expect(() => executor.execute({ node, valuedInputs: new Map() })).rejects.toThrow(
				NodeExecutorMissingInputException
			);
		});
	});

	it("should execute a `node-code` ('Calculate quotient' & 'Calculate remainder')", async () => {
		const [codeQuotient, codeRemainder] = await Promise.all([
			service.findById(db.graph.nodes[5]._id),
			service.findById(db.graph.nodes[6]._id)
		]);

		expect(codeQuotient.behavior.type).toBe(NodeBehaviorType.CODE);
		expect(codeRemainder.behavior.type).toBe(NodeBehaviorType.CODE);

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
		const fnDivision = await service.findById(db.graph.nodes[7]._id);
		expect(fnDivision.behavior.type).toBe(NodeBehaviorType.FUNCTION);

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
				{ output: quotientOutput, value: quotient },
				{ output: remainderOutput, value: remainder }
			] = outputs;

			// The values are correct
			expect(quotient).toBe(divisor === 0 ? 0 : Math.floor(dividend / divisor));
			expect(remainder).toBe(divisor === 0 ? dividend : dividend % divisor);

			// The outputs of the nodes are correct
			expect(quotientOutput).toStrictEqual(fnQuotient);
			expect(remainderOutput).toStrictEqual(fnRemainder);
		}

		await dbTest.refresh();
	});

	describe("Parameters", () => {
		it("should execute a `node-parameter-in`", async () => {
			const [fnInput] = db.graph.nodes[7].inputs;
			const node = await service.findById(db.graph.nodes[8]._id);

			const behavior = node.behavior as NodeBehaviorParameterInput;
			expect(behavior.type).toBe(NodeBehaviorType.PARAMETER_IN);
			expect(behavior.__node_input).toBe(fnInput._id);

			const expectedValue = Math.floor(Math.random() * 1000);
			const [{ output, value }] = await executor.execute({
				node,
				valuedInputs: new Map([[fnInput._id, expectedValue]])
			});

			expect(value).toBe(expectedValue);
			expect(output._id).toBe(node.outputs[0]._id);
		});

		it("should execute a `node-parameter-out`", async () => {
			const [fnOutput] = db.graph.nodes[7].outputs;
			const node = await service.findById(db.graph.nodes[10]._id);

			const behavior = node.behavior as NodeBehaviorParameterOutput;
			expect(behavior.type).toBe(NodeBehaviorType.PARAMETER_OUT);
			expect(behavior.__node_output).toBe(fnOutput._id);

			const expectedValue = Math.floor(Math.random() * 1000);
			const [{ output, value }] = await executor.execute({
				node,
				valuedInputs: new Map([[node.inputs[0]._id, expectedValue]])
			});

			expect(value).toBe(expectedValue);
			expect(output._id).toBe(fnOutput._id);
		});
	});

	describe("Triggers", () => {
		it("should execute a `node-trigger` (CRON)", async () => {
			const node = await service.findById(db.graph.nodes[12]._id);
			expect(node.behavior.type).toBe(NodeBehaviorType.TRIGGER);
			expect((node.behavior as NodeBehaviorTrigger).trigger.type).toBe(NodeTriggerType.CRON);

			const now = new Date().getTime();
			const outputs = await executor.execute({ node: node, valuedInputs: new Map() });
			expect(outputs).toHaveLength(1);

			const [{ output, value }] = outputs;
			expect(value).toBeGreaterThanOrEqual(now);
			expect(value).toBeLessThanOrEqual(now + 20);

			expect(output).toStrictEqual(node.outputs[0]);
		});
	});

	it("should execute a `node-variable`", async () => {
		for (const { _id } of db.graph.nodes.slice(0, 4)) {
			const node = await service.findById(_id);
			expect(node.behavior.type).toBe(NodeBehaviorType.VARIABLE);

			const outputValues = await executor.execute({ node: node, valuedInputs: new Map() });
			expect(outputValues).toHaveLength(1);

			const [{ output: outputValue, value }] = outputValues;

			expect(value).toBe((node.behavior as NodeBehaviorVariable).value);
			expect(outputValue).toStrictEqual(node.outputs[0]);
		}
	});

	describe("References", () => {
		beforeEach(() => dbTest.refresh());

		it("should execute a `node-code` reference ('Calculate remainder')", async () => {
			const node = await service.findById(db.graph.nodes[14]._id);
			expect(node.behavior.type).toBe(NodeBehaviorType.REFERENCE);

			const [dividend, divisor] = [50, 3];
			const {
				inputs: [iDividend, iDivisor],
				outputs: [oQuotient]
			} = node;

			const [{ output, value }] = await executor.execute({
				node,
				valuedInputs: new Map([
					[iDividend._id, dividend],
					[iDivisor._id, divisor]
				])
			});
			expect(value).toBe(dividend % divisor);
			expect(output.toJSON!()).toStrictEqual(oQuotient.toJSON!());
		});

		it("should execute a `node-function` reference ('Integer division')", async () => {
			const node = await service.create({
				behavior: { __node: db.graph.nodes[7]._id, type: NodeBehaviorType.REFERENCE },
				kind: { __graph: 1, position: { x: 0, y: 0 }, type: NodeKindType.EDGE },
				name: "fn ref"
			});
			expect(node.behavior.type).toBe(NodeBehaviorType.REFERENCE);

			const [dividend, divisor] = [12, 10];
			const {
				inputs: [iDividend, iDivisor],
				outputs: [oQuotient, oRemainder]
			} = node;

			const [
				{ output: ovQuotient, value: quotient },
				{ output: ovRemainder, value: remainder }
			] = await executor.execute({
				node,
				valuedInputs: new Map([
					[iDividend._id, dividend],
					[iDivisor._id, divisor]
				])
			});

			// The values are correct
			expect(quotient).toBe(divisor === 0 ? 0 : Math.floor(dividend / divisor));
			expect(remainder).toBe(dividend % divisor);

			// The outputs of the nodes are correct
			expect(ovQuotient).toStrictEqual(oQuotient);
			expect(ovRemainder).toStrictEqual(oRemainder);
		});

		it("should execute a `node-variable` reference (~= global variable)", async () => {
			const nodeRef = await service.findById(db.graph.nodes[0]._id);
			const node = await service.create({
				behavior: { __node: nodeRef._id, type: NodeBehaviorType.REFERENCE },
				kind: { __graph: 1, position: { x: 0, y: 0 }, type: NodeKindType.EDGE },
				name: "var ref"
			});
			expect(nodeRef.behavior.type).toBe(NodeBehaviorType.VARIABLE);
			expect(node.behavior.type).toBe(NodeBehaviorType.REFERENCE);

			const [{ output, value }] = await executor.execute({ node, valuedInputs: new Map() });
			expect(value).toBe((nodeRef.behavior as NodeBehaviorVariable).value);
			expect(output).toStrictEqual(node.outputs[0]);
		});
	});
});
