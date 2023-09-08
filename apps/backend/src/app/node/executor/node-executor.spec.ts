import { Test } from "@nestjs/testing";
import { NodeBehaviorType } from "~/lib/common/app/node/dtos/behaviors";
import { NodeTriggerType } from "~/lib/common/app/node/dtos/behaviors/triggers";
import { BASE_SEED } from "~/lib/common/seeds";

import {
	NodeExecutorMissingInputException,
	NodeExecutorNotExecutableException
} from "./exceptions";
import { NodeExecutor } from "./node-executor";
import { DbTestHelper } from "../../../../test/db-test";
import { OrmModule } from "../../../orm/orm.module";
import { NodeBehaviorTrigger } from "../behaviors/node-behavior.trigger";
import { NodeBehaviorVariable } from "../behaviors/parameters";
import { NodeModule } from "../node.module";
import { NodeService } from "../node.service";

describe("NodeExecutor", () => {
	let db: typeof BASE_SEED;
	let dbTest: DbTestHelper;
	let executor: NodeExecutor;
	let service: NodeService;

	beforeAll(async () => {
		const module = await Test.createTestingModule({
			imports: [OrmModule, NodeModule]
		}).compile();

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
			const node = await service.findById(db.node.nodes[5]._id);
			expect(node.behavior.type).toBe(NodeBehaviorType.CODE);
			await expect(() => executor.execute({ node, valuedInputs: new Map() })).rejects.toThrow(
				NodeExecutorMissingInputException
			);
		});

		it("should not execute a `node-parameter-in`", async () => {
			for (const { _id } of [db.node.nodes[8], db.node.nodes[9]]) {
				const node = await service.findById(_id);
				expect(node.behavior.type).toBe(NodeBehaviorType.PARAMETER_IN);

				await expect(() =>
					executor.execute({ node, valuedInputs: new Map([]) })
				).rejects.toThrow(NodeExecutorNotExecutableException);
			}
		});

		it("should not execute a `node-parameter-out`", async () => {
			for (const { _id } of [db.node.nodes[10], db.node.nodes[11]]) {
				const node = await service.findById(_id);
				expect(node.behavior.type).toBe(NodeBehaviorType.PARAMETER_OUT);

				await expect(() =>
					executor.execute({ node, valuedInputs: new Map([]) })
				).rejects.toThrow(NodeExecutorNotExecutableException);
			}
		});
	});

	it("should execute a `node-code` ('Calculate quotient' & 'Calculate remainder')", async () => {
		const [codeQuotient, codeRemainder] = await Promise.all([
			service.findById(db.node.nodes[5]._id),
			service.findById(db.node.nodes[6]._id)
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
		const fnDivision = await service.findById(db.node.nodes[7]._id);
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
	});

	describe("Triggers", () => {
		it("should execute a `node-trigger` (CRON)", async () => {
			const node = await service.findById(db.node.nodes[12]._id);
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
		for (const { _id } of db.node.nodes.slice(0, 4)) {
			const node = await service.findById(_id);
			expect(node.behavior.type).toBe(NodeBehaviorType.VARIABLE);

			const outputValues = await executor.execute({ node, valuedInputs: new Map() });
			expect(outputValues).toHaveLength(1);

			const [{ output: outputValue, value }] = outputValues;

			expect(value).toBe((node.behavior as NodeBehaviorVariable).value);
			expect(outputValue).toStrictEqual(node.outputs[0]);
		}
	});
});
