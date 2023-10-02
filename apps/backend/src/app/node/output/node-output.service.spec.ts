import { Test } from "@nestjs/testing";
import { NodeBehaviorType } from "~/lib/common/app/node/dtos/behaviors/node-behavior.type";
import { NodeOutputUpdateDto } from "~/lib/common/app/node/dtos/output";
import { NodeIoType } from "~/lib/common/app/node/io";
import { ONLY_NODES_SEED } from "~/lib/common/seeds";

import { NodeOutputReadonlyException } from "./exceptions";
import { NodeOutputService } from "./node-output.service";
import { DbTestHelper } from "../../../../test/db-test";
import { OrmModule } from "../../../orm/orm.module";
import { NodeModule } from "../node.module";
import { NodeService } from "../node.service";

describe("NodeOutputService", () => {
	let service: NodeOutputService;
	let nodeService: NodeService;
	let dbTest: DbTestHelper;

	let dbNodes: (typeof ONLY_NODES_SEED)["graph"]["nodes"];

	beforeAll(async () => {
		const module = await Test.createTestingModule({
			imports: [OrmModule, NodeModule]
		}).compile();

		service = module.get(NodeOutputService);
		nodeService = module.get(NodeService);
		dbTest = new DbTestHelper(module, { sample: "only-nodes" });

		dbNodes = dbTest.db.graph.nodes as never;
	});

	afterAll(() => dbTest.close());

	describe("Update", () => {
		beforeEach(() => dbTest.refresh());

		it("should update the output of a node (CODE, PARAMETER_IN & VARIABLE)", async () => {
			const nodeVar = await nodeService.findById(dbNodes[0]._id);
			const nodeCode = await nodeService.findById(dbNodes[1]._id);
			const nodeParameterIn = await nodeService.findById(dbNodes[4]._id);

			expect(nodeVar.behavior.type).toBe(NodeBehaviorType.VARIABLE);
			expect(nodeCode.behavior.type).toBe(NodeBehaviorType.CODE);
			expect(nodeParameterIn.behavior.type).toBe(NodeBehaviorType.PARAMETER_IN);
			expect(nodeVar.outputs).not.toHaveLength(0);
			expect(nodeCode.outputs).not.toHaveLength(0);
			expect(nodeParameterIn.outputs).not.toHaveLength(0);

			const toUpdate: NodeOutputUpdateDto = { name: "1", type: NodeIoType.STRING };
			for (const node of [nodeVar, nodeCode, nodeParameterIn]) {
				const [output] = node.outputs.getItems();
				const updated = await service.updateFromNode(node, output._id, toUpdate);

				expect(updated.name).toBe(toUpdate.name);
				expect(updated.type).toBe(toUpdate.type);
			}
		});

		it("should fail when trying to update readonly outputs", async () => {
			const nodeTrigger = await nodeService.findById(dbNodes[2]._id);
			const nodeFunction = await nodeService.findById(dbNodes[3]._id);
			const nodeReference = await nodeService.findById(dbNodes[6]._id);

			expect(nodeTrigger.behavior.type).toBe(NodeBehaviorType.TRIGGER);
			expect(nodeFunction.behavior.type).toBe(NodeBehaviorType.FUNCTION);
			expect(nodeReference.behavior.type).toBe(NodeBehaviorType.REFERENCE);
			expect(nodeTrigger.outputs).not.toHaveLength(0);
			expect(nodeFunction.outputs).not.toHaveLength(0);
			expect(nodeReference.outputs).not.toHaveLength(0);

			const toUpdate: NodeOutputUpdateDto = { name: "1", type: NodeIoType.STRING };
			for (const node of [nodeTrigger, nodeFunction, nodeReference]) {
				const [output] = node.outputs.getItems();
				await expect(() =>
					service.updateFromNode(node, output._id, toUpdate)
				).rejects.toThrow(NodeOutputReadonlyException);
			}
		});
	});
});
