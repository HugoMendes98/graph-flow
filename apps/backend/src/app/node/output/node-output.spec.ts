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

describe("NodeOutput", () => {
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

		it("should create a default output for `CODE`", async () => {
			const { outputs } = await nodeService.create({
				...partialCreate,
				behavior: { code: "", type: NodeBehaviorType.CODE }
			});

			expect(outputs).toHaveLength(1);

			const [output] = outputs.getItems();
			expect(output.__ref).toBeNull();
			expect(output.name).toBe("");
			expect(output.type).toBe(NodeIoType.ANY);
		});

		it("should NOT create a default output for `FUNCTION`", async () => {
			const { outputs } = await nodeService.create({
				...partialCreate,
				behavior: { type: NodeBehaviorType.FUNCTION }
			});

			expect(outputs).toHaveLength(0);
		});

		it("should create default outputs for `PARAMETER`s", async () => {
			const nodeFn = await nodeService.create({
				...partialCreate,
				behavior: { type: NodeBehaviorType.FUNCTION }
			});

			const kind: NodeCreateEntity["kind"] = {
				__graph: (nodeFn.behavior as NodeBehaviorFunctionDto).__graph,
				position: { x: 0, y: 0 },
				type: NodeKindType.VERTEX
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

			const { outputs } = parameterIn;
			expect(outputs).toHaveLength(1);

			const [output] = outputs.getItems();
			expect(output.__ref).toBeNull();
			expect(output.name).toBe("");
			expect(output.type).toBe(NodeIoType.ANY);

			// No output for parameter-out
			expect(parameterOut.outputs).toHaveLength(0);
		});

		it("should copy outputs for `REFERENCE`", async () => {
			const dbTestBase = dbTest.transformTo("base");

			/* eslint-disable jest/no-conditional-expect -- To close db */
			return dbTestBase
				.refresh()
				.then(async () => {
					const db = dbTestBase.db as typeof BASE_SEED;

					const reference = await nodeService.findById(db.graph.nodes[0]._id);
					const { outputs } = await nodeService.create({
						behavior: { __node: reference._id, type: NodeBehaviorType.REFERENCE },
						kind: { __graph: 1, position: { x: 0, y: 0 }, type: NodeKindType.VERTEX },
						name: `*${reference.name}`
					});

					expect(outputs).toHaveLength(reference.outputs.length);

					for (const [i, output] of outputs.getItems().entries()) {
						const outputRef = reference.outputs[i];
						expect(output.__ref).toBe(outputRef._id);
						expect(output.type).toBe(outputRef.type);
						expect(output._created_at).not.toStrictEqual(outputRef._created_at);
					}
				})
				.then(() => dbTestBase.close())
				.catch(async (err: unknown) => {
					await dbTestBase.close();
					throw err;
				});
			/* eslint-enable */
		});

		it("should create a default output for `TRIGGER` (cron)", async () => {
			const { outputs } = await nodeService.create({
				...partialCreate,
				behavior: {
					trigger: { cron: "* * * * *", type: NodeTriggerType.CRON },
					type: NodeBehaviorType.TRIGGER
				}
			});

			expect(outputs).toHaveLength(1);

			const [output] = outputs.getItems();
			expect(output.__ref).toBeNull();
			expect(output.name).toBe("");
			expect(output.type).toBe(NodeIoType.NUMBER);
		});

		it("should create a default output for `VARIABLE`", async () => {
			const { outputs } = await nodeService.create({
				...partialCreate,
				behavior: { type: NodeBehaviorType.VARIABLE, value: 0 }
			});

			expect(outputs).toHaveLength(1);

			const [output] = outputs.getItems();
			expect(output.__ref).toBeNull();
			expect(output.name).toBe("");
			expect(output.type).toBe(NodeIoType.ANY);
		});
	});
});
