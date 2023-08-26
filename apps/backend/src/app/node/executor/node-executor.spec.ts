import { Test } from "@nestjs/testing";
import { NodeBehaviorType } from "~/lib/common/app/node/dtos/behaviors";
import { BASE_SEED } from "~/lib/common/seeds";
import { omit } from "~/lib/common/utils/object-fns";

import { NodeExecutor } from "./node-executor";
import { DbTestHelper } from "../../../../test/db-test";
import { OrmModule } from "../../../orm/orm.module";
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

		db = dbTest.db as typeof BASE_SEED;
	});

	afterAll(() => dbTest.close());

	it("should execute a `node-code` ('Calculate quotient' & 'Calculate remainder')", async () => {
		const [codeQuotient, codeRemainder] = await Promise.all(
			[service.findById(db.node.nodes[5]._id), service.findById(db.node.nodes[6]._id)].map(
				promise => promise.then(n => n.toJSON())
			)
		);

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
			const quotientOutputs = await executor.execute(codeQuotient, [
				{ ...qDividend, value: dividend },
				{ ...qDivisor, value: divisor }
			]);
			const remainderOutputs = await executor.execute(codeRemainder, [
				{ ...rDividend, value: dividend },
				{ ...rDivisor, value: divisor }
			]);

			expect(quotientOutputs).toHaveLength(1);
			expect(remainderOutputs).toHaveLength(1);

			const [{ value: quotient, ...quotientOutput }] = quotientOutputs;
			const [{ value: remainder, ...remainderOutput }] = remainderOutputs;

			// The values are correct
			expect(quotient).toBe(divisor === 0 ? 0 : Math.floor(dividend / divisor));
			expect(remainder).toBe(dividend % divisor);

			// The outputs of the nodes are correct
			expect(quotientOutput).toStrictEqual(codeQuotientOutput);
			expect(remainderOutput).toStrictEqual(codeRemainderOutput);
		}
	});

	it("should execute a `node-function` ('Integer division')", async () => {
		const fnDivision = await service.findById(db.node.nodes[7]._id).then(n => n.toJSON());
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
			const outputs = await executor.execute(fnDivision, [
				{ ...fnDividend, value: dividend },
				{ ...fnDivisor, value: divisor }
			]);
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

	it("should execute a `node-variable`", async () => {
		for (const { _id } of db.node.nodes.slice(0, 4)) {
			const node = await service.findById(_id).then(n => n.toJSON());
			expect(node.behavior.type).toBe(NodeBehaviorType.VARIABLE);

			const outputValues = await executor.execute(node, []);
			expect(outputValues).toHaveLength(1);

			const [outputValue] = outputValues;

			expect(outputValue.value).toBe((node.behavior as NodeBehaviorVariable).value);
			expect(omit(outputValue, ["value"])).toStrictEqual(node.outputs[0]);
		}
	});
});
