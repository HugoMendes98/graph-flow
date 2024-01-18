import { Test } from "@nestjs/testing";
import { NodeBehaviorType } from "~/lib/common/app/node/dtos/behaviors/node-behavior.type";
import {
	NodeInputCreateDto,
	NodeInputUpdateDto
} from "~/lib/common/app/node/dtos/input";
import { NodeIoType } from "~/lib/common/app/node/io";
import { ONLY_NODES_SEED } from "~/lib/common/seeds";
import { omit } from "~/lib/common/utils/object-fns";

import { NodeInputReadonlyException } from "./exceptions";
import { NodeInputService } from "./node-input.service";
import { DbTestHelper } from "../../../../test/db-test";
import { OrmModule } from "../../../orm/orm.module";
import { NodeModule } from "../node.module";
import { NodeService } from "../node.service";

describe("NodeInputService", () => {
	let service: NodeInputService;
	let nodeService: NodeService;
	let dbTest: DbTestHelper;

	let dbNodes: (typeof ONLY_NODES_SEED)["graph"]["nodes"];

	beforeAll(async () => {
		const module = await Test.createTestingModule({
			imports: [OrmModule, NodeModule]
		}).compile();

		service = module.get(NodeInputService);
		nodeService = module.get(NodeService);
		dbTest = new DbTestHelper(module, { sample: "only-nodes" });

		dbNodes = dbTest.db.graph.nodes as never;
	});

	afterAll(() => dbTest.close());

	const getAllNodes = async () => {
		// Get each type of node (and verify that the seed is correct)
		const nodeVariable = await nodeService.findById(dbNodes[0]._id);
		const nodeCode = await nodeService.findById(dbNodes[1]._id);
		const nodeTrigger = await nodeService.findById(dbNodes[2]._id);
		const nodeFunction = await nodeService.findById(dbNodes[3]._id);
		const nodeParameterIn = await nodeService.findById(dbNodes[4]._id);
		const nodeParameterOut = await nodeService.findById(dbNodes[5]._id);
		const nodeReference = await nodeService.findById(dbNodes[6]._id);

		expect(nodeVariable.behavior.type).toBe(NodeBehaviorType.VARIABLE);
		expect(nodeCode.behavior.type).toBe(NodeBehaviorType.CODE);
		expect(nodeTrigger.behavior.type).toBe(NodeBehaviorType.TRIGGER);
		expect(nodeFunction.behavior.type).toBe(NodeBehaviorType.FUNCTION);
		expect(nodeParameterIn.behavior.type).toBe(
			NodeBehaviorType.PARAMETER_IN
		);
		expect(nodeParameterOut.behavior.type).toBe(
			NodeBehaviorType.PARAMETER_OUT
		);
		expect(nodeReference.behavior.type).toBe(NodeBehaviorType.REFERENCE);

		return {
			nodeCode,
			nodeFunction,
			nodeParameterIn,
			nodeParameterOut,
			nodeReference,
			nodeTrigger,
			nodeVariable
		};
	};

	describe("Create", () => {
		beforeEach(() => dbTest.refresh());

		it("should create an input for a node (CODE)", async () => {
			const { nodeCode } = await getAllNodes();

			const toCreate: NodeInputCreateDto = {
				name: "1",
				type: NodeIoType.STRING
			};
			for (const node of [nodeCode]) {
				const beforeLength = node.inputs.length;
				const updated = await service.createFromNode(node, toCreate);

				expect(updated.name).toBe(toCreate.name);
				expect(updated.type).toBe(toCreate.type);

				const { inputs } = await nodeService.findById(node._id);
				expect(inputs).toHaveLength(beforeLength + 1);
				expect(
					inputs.getItems().some(({ _id }) => _id === updated._id)
				).toBe(true);
			}
		});

		it("should fail when trying to create readonly inputs", async () => {
			const nodes = await getAllNodes();

			const toCreate: NodeInputCreateDto = {
				name: "1",
				type: NodeIoType.STRING
			};
			for (const node of Object.values(omit(nodes, ["nodeCode"]))) {
				await expect(() =>
					service.createFromNode(node, toCreate)
				).rejects.toThrow(NodeInputReadonlyException);
			}
		});
	});

	describe("Update", () => {
		beforeEach(() => dbTest.refresh());

		it("should update the input of a node (CODE & PARAMETER_OUT)", async () => {
			const { nodeCode, nodeParameterOut } = await getAllNodes();

			const toUpdate: NodeInputUpdateDto = {
				name: "1",
				type: NodeIoType.STRING
			};
			for (const node of [nodeCode, nodeParameterOut]) {
				const [input] = node.inputs.getItems();
				const updated = await service.updateFromNode(
					node,
					input._id,
					toUpdate
				);

				expect(updated.name).toBe(toUpdate.name);
				expect(updated.type).toBe(toUpdate.type);
			}
		});

		it("should fail when trying to update readonly inputs", async () => {
			const { nodeFunction, nodeReference, nodeVariable } =
				await getAllNodes();

			const toUpdate: NodeInputUpdateDto = {
				name: "1",
				type: NodeIoType.STRING
			};
			for (const node of [nodeFunction, nodeReference, nodeVariable]) {
				const [input] = node.inputs.getItems();
				await expect(() =>
					service.updateFromNode(node, input._id, toUpdate)
				).rejects.toThrow(NodeInputReadonlyException);
			}
		});
	});

	describe("Delete", () => {
		beforeEach(() => dbTest.refresh());

		it("should delete an input for a node (CODE)", async () => {
			const { nodeCode } = await getAllNodes();
			for (const node of [nodeCode]) {
				const beforeLength = node.inputs.length;
				const deleted = await service.deleteFromNode(
					node,
					node.inputs.getItems()[0]._id
				);

				const { inputs } = await nodeService.findById(node._id);
				expect(inputs).toHaveLength(beforeLength - 1);
				expect(
					inputs.getItems().some(({ _id }) => _id === deleted._id)
				).toBe(false);
			}
		});

		it("should fail when trying to delete readonly inputs", async () => {
			const {
				nodeFunction,
				nodeParameterOut,
				nodeReference,
				nodeVariable
			} = await getAllNodes();

			for (const node of [
				nodeFunction,
				nodeParameterOut,
				nodeReference,
				nodeVariable
			]) {
				await expect(() =>
					service.deleteFromNode(node, node.inputs.getItems()[0]._id)
				).rejects.toThrow(NodeInputReadonlyException);
			}
		});
	});
});
