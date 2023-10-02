import { Test } from "@nestjs/testing";
import { NodeBehaviorFunctionDto } from "~/lib/common/app/node/dtos/behaviors";
import { NodeBehaviorType } from "~/lib/common/app/node/dtos/behaviors/node-behavior.type";
import { NodeTriggerType } from "~/lib/common/app/node/dtos/behaviors/triggers";
import { NodeKindType } from "~/lib/common/app/node/dtos/kind/node-kind.type";
import { NodeIoType } from "~/lib/common/app/node/io";
import { BASE_SEED } from "~/lib/common/seeds";

import { DbTestHelper } from "../../../../test/db-test";
import { OrmModule } from "../../../orm/orm.module";
import { NodeModule } from "../node.module";
import { NodeCreateEntity, NodeService } from "../node.service";

describe("NodeInput", () => {
	let nodeService: NodeService;
	let dbTest: DbTestHelper;

	beforeAll(async () => {
		const module = await Test.createTestingModule({
			imports: [OrmModule, NodeModule]
		}).compile();

		nodeService = module.get(NodeService);
		dbTest = new DbTestHelper(module, { sample: "empty" });
	});

	afterAll(() => dbTest.close());

	describe("On node creation", () => {
		const partialCreate: Omit<NodeCreateEntity, "behavior"> = {
			kind: { active: false, type: NodeKindType.TEMPLATE },
			name: "node"
		};

		beforeEach(() => dbTest.refresh());

		it("should NOT create a default input for `CODE`", async () => {
			const { inputs } = await nodeService.create({
				...partialCreate,
				behavior: { code: "", type: NodeBehaviorType.CODE }
			});

			expect(inputs).toHaveLength(0);
		});

		it("should NOT create a default input for `FUNCTION`", async () => {
			const { inputs } = await nodeService.create({
				...partialCreate,
				behavior: { type: NodeBehaviorType.FUNCTION }
			});

			expect(inputs).toHaveLength(0);
		});

		it("should create default inputs for `PARAMETER`s", async () => {
			const nodeFn = await nodeService.create({
				...partialCreate,
				behavior: { type: NodeBehaviorType.FUNCTION }
			});

			const kind: NodeCreateEntity["kind"] = {
				__graph: (nodeFn.behavior as NodeBehaviorFunctionDto).__graph,
				position: { x: 0, y: 0 },
				type: NodeKindType.EDGE
			};

			const parameterIn = await nodeService.create({
				behavior: { type: NodeBehaviorType.PARAMETER_IN },
				kind,
				name: "node-in"
			});
			const parameterOut = await nodeService.create({
				behavior: { type: NodeBehaviorType.PARAMETER_OUT },
				kind,
				name: "node-out"
			});

			// No output for parameter-in
			expect(parameterIn.inputs).toHaveLength(0);

			const { inputs } = parameterOut;
			expect(inputs).toHaveLength(1);

			const [output] = inputs.getItems();
			expect(output.__ref).toBeNull();
			expect(output.name).toBe("");
			expect(output.type).toBe(NodeIoType.ANY);
		});

		it("should copy inputs for `REFERENCE`", async () => {
			const dbTestBase = dbTest.transformTo("base");

			/* eslint-disable jest/no-conditional-expect -- To close db */
			return dbTestBase
				.refresh()
				.then(async () => {
					const db = dbTestBase.db as typeof BASE_SEED;

					const reference = await nodeService.findById(db.graph.nodes[0]._id);
					const { inputs } = await nodeService.create({
						behavior: { __node: reference._id, type: NodeBehaviorType.REFERENCE },
						kind: { __graph: 1, position: { x: 0, y: 0 }, type: NodeKindType.EDGE },
						name: `*${reference.name}`
					});

					expect(inputs).toHaveLength(reference.inputs.length);

					for (const [i, input] of inputs.getItems().entries()) {
						const inputRef = reference.inputs[i];
						expect(input.__ref).toBe(inputRef._id);
						expect(input.type).toBe(inputRef.type);
						expect(input._created_at).not.toStrictEqual(inputRef._created_at);
					}
				})
				.then(() => dbTestBase.close())
				.catch(async (err: unknown) => {
					await dbTestBase.close();
					throw err;
				});
			/* eslint-enable */
		});

		it("should NOT create inputs for `TRIGGER` (cron)", async () => {
			const { inputs } = await nodeService.create({
				...partialCreate,
				behavior: {
					trigger: { cron: "* * * * *", type: NodeTriggerType.CRON },
					type: NodeBehaviorType.TRIGGER
				}
			});

			expect(inputs).toHaveLength(0);
		});

		it("should create a default input for `VARIABLE`", async () => {
			const { inputs } = await nodeService.create({
				...partialCreate,
				behavior: { type: NodeBehaviorType.VARIABLE, value: 0 }
			});

			expect(inputs).toHaveLength(1);

			const [input] = inputs.getItems();
			expect(input.__ref).toBeNull();
			expect(input.name).toBe("");
			expect(input.type).toBe(NodeIoType.VOID);
		});
	});
});
