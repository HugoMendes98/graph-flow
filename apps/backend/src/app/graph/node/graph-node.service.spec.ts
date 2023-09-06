import { NotFoundError } from "@mikro-orm/core";
import { Test, TestingModule } from "@nestjs/testing";
import { GraphNodeUpdateDto } from "~/lib/common/app/graph/dtos/node";
import { NodeBehaviorType } from "~/lib/common/app/node/dtos/behaviors";
import { BASE_SEED } from "~/lib/common/seeds";
import { omit } from "~/lib/common/utils/object-fns";

import {
	GraphNodeTriggerInFunctionException,
	GraphNodeTriggerInWorkflowException
} from "./exceptions";
import { GraphNodeCreate, GraphNodeService } from "./graph-node.service";
import { GraphNodeInputRepository } from "./input";
import { GraphNodeOutputRepository } from "./output";
import { DbTestHelper } from "../../../../test/db-test";
import { OrmModule } from "../../../orm/orm.module";
import { EntityBase } from "../../_lib/entity";
import { NodeService } from "../../node/node.service";
import { GraphArcService } from "../arc/graph-arc.service";
import { GraphModule } from "../graph.module";

describe("GraphNodeService", () => {
	let service: GraphNodeService;
	let graphArcService: GraphArcService;
	let nodeService: NodeService;

	let dbTest: DbTestHelper;
	let db: typeof BASE_SEED;

	let repositories: { input: GraphNodeInputRepository; output: GraphNodeOutputRepository };

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [OrmModule, GraphModule]
		}).compile();

		dbTest = new DbTestHelper(module);
		db = dbTest.db as never;

		service = module.get(GraphNodeService);
		graphArcService = module.get(GraphArcService);
		nodeService = module.get(NodeService);

		repositories = {
			input: module.get(GraphNodeInputRepository),
			output: module.get(GraphNodeOutputRepository)
		};
	});

	afterAll(() => dbTest.close());

	it("should be defined", () => {
		expect(service).toBeDefined();
		expect(repositories.input).toBeDefined();
		expect(repositories.output).toBeDefined();
	});

	describe("With Input/Outputs and Arcs", () => {
		beforeEach(() => dbTest.refresh());

		it("should copy the name of the node when the name of graph-node is not defined", async () => {
			const node = await nodeService.findById(db.node.nodes[4]._id);

			const graphNode = await service.create({
				__graph: db.graph.graphs[0]._id,
				__node: node._id,
				position: { x: 0, y: 0 }
			});

			expect(graphNode.name).toBe(node.name);
		});

		it("should copy the inputs and outputs of the added node", async () => {
			const node = await nodeService.findById(db.node.nodes[4]._id, {
				populate: { inputs: true, outputs: true }
			});

			const graphNode = await service.create(
				{
					__graph: db.graph.graphs[0]._id,
					__node: node._id,
					name: "new graph-node",
					position: { x: 0, y: 0 }
				},
				{ findOptions: { populate: { inputs: true, outputs: true } } }
			);

			expect(graphNode.inputs).toHaveLength(node.inputs.length);
			expect(graphNode.outputs).toHaveLength(node.outputs.length);

			for (const io of [...graphNode.inputs, ...graphNode.outputs] as const) {
				expect(io.__graph_node).toBe(graphNode._id);
			}

			const gInputs = graphNode.inputs
				.getItems()
				.map(({ __node_input }) => __node_input)
				.sort();
			const gOutputs = graphNode.outputs
				.getItems()
				.map(({ __node_output }) => __node_output)
				.sort();

			const nInputs = node.inputs
				.getItems()
				.map(({ _id }) => _id)
				.sort();
			const nOutputs = node.outputs
				.getItems()
				.map(({ _id }) => _id)
				.sort();

			expect(gInputs).toStrictEqual(nInputs);
			expect(gOutputs).toStrictEqual(nOutputs);
		});

		it("should remove inputs and arcs when deleting a graph-node", async () => {
			const graphNode = await service.findById(db.graph.graphNodes[10]._id);
			// For test verification; do not use a possibly used node if it is "locked"
			expect(graphNode.__graph).toBe(2);

			const { inputs, outputs } = graphNode;
			const { data: arcs } = await graphArcService.findAndCount({
				$or: [
					{ from: { __graph_node: graphNode._id } },
					{ to: { __graph_node: graphNode._id } }
				]
			});

			// Need to have some data before
			expect(arcs).not.toHaveLength(0);
			expect(inputs).not.toHaveLength(0);
			expect(outputs).not.toHaveLength(0);

			await service.delete(graphNode._id);

			// search by ids so that is not linked with the foreign keys
			const {
				pagination: { total: totalArcs }
			} = await graphArcService.findAndCount({ _id: { $in: arcs.map(({ _id }) => _id) } });
			expect(totalArcs).toBe(0);

			for (const [repository, entities] of [
				[repositories.input, inputs],
				[repositories.output, outputs]
			] as const) {
				const [, total] = await repository.findAndCount({
					_id: { $in: entities.getItems().map(({ _id }: EntityBase) => _id) }
				});
				expect(total).toBe(0);
			}
		});
	});

	describe("With Graph", () => {
		beforeEach(() => dbTest.refresh());

		it("should fail when adding more that one 'trigger' node in a `workflow`", async () => {
			// The 3rd graph is empty and linked to a 'workflow'
			const [, graph] = db.graph.graphs;
			const trigger = db.node.nodes.find(
				({ behavior: { type } }) => type === NodeBehaviorType.TRIGGER
			);

			expect(trigger).toBeDefined();
			await expect(() =>
				service.create({
					__graph: graph._id,
					__node: trigger!._id,
					position: { x: 0, y: 0 }
				})
			).rejects.toThrow(GraphNodeTriggerInWorkflowException);
		});

		it("should fail when adding any 'trigger' node in a `node-function`", async () => {
			// The first graph is linked to a 'node-function'
			const [graph] = db.graph.graphs;
			const trigger = db.node.nodes.find(
				({ behavior: { type } }) => type === NodeBehaviorType.TRIGGER
			);

			expect(trigger).toBeDefined();
			await expect(() =>
				service.create({
					__graph: graph._id,
					__node: trigger!._id,
					position: { x: 0, y: 0 }
				})
			).rejects.toThrow(GraphNodeTriggerInFunctionException);
		});

		// TODO: Test that a node-function 'A' is not used in another function 'B'
		//  if using itself the node-function 'B'.
		//	B uses A, A uses B, B uses A, A uses B, ...

		// This currently creates an infinite loop.
		// With conditional nodes, it can work.
	});

	describe("CRUD basic", () => {
		let graphNodes: typeof dbTest.db.graph.graphNodes;

		beforeEach(() => {
			graphNodes = dbTest.db.graph.graphNodes;
		});

		describe("Read", () => {
			beforeEach(() => dbTest.refresh());

			it("should get one", async () => {
				for (const node of graphNodes) {
					const row = await service.findById(node._id);
					expect(omit(row.toJSON(), ["inputs", "outputs"])).toStrictEqual(node);
				}
			});

			it("should fail when getting one by an unknown id", async () => {
				const id = Math.max(...graphNodes.map(({ _id }) => _id)) + 1;
				await expect(service.findById(id)).rejects.toThrow(NotFoundError);
			});
		});

		describe("Create", () => {
			it("should add a new entity", async () => {
				const {
					graph: {
						graphs: [graph]
					},
					node: {
						nodes: [node]
					}
				} = dbTest.db;

				// Backup previous data
				const { data: before } = await service.findAndCount();

				const toCreate = {
					__graph: graph._id,
					__node: node._id,
					name: `graph-${node.name}`,
					position: { x: 123, y: 456 }
				} as const satisfies GraphNodeCreate;
				const created = await service.create(toCreate);
				expect(created.__graph).toBe(toCreate.__graph);
				expect(created.__node).toBe(toCreate.__node);
				expect(created.name).toBe(toCreate.name);
				expect(created.position.x).toBe(toCreate.position.x);
				expect(created.position.y).toBe(toCreate.position.y);

				// Check that the entity is in the data (should have one more than before)
				const { data: after } = await service.findAndCount();
				expect(after).toHaveLength(before.length + 1);

				// Check that the value returned in the list is equal to the one just created
				const found = after.find(({ _id }) => _id === created._id);
				expect(found).toBeDefined();
				expect(created.toJSON()).toStrictEqual(found!.toJSON());
			});
		});

		describe("Update", () => {
			beforeEach(() => dbTest.refresh());

			it("should update an entity", async () => {
				// Backup previous data
				const { data: before } = await service.findAndCount();

				// Update an entity and check its content
				const [node] = graphNodes;
				const toUpdate = {
					name: `${node.name}-${node.name}`,
					position: { x: node.position.x * 2, y: node.position.y * 2 }
				} as const satisfies GraphNodeUpdateDto;
				const updated = await service.update(node._id, toUpdate);
				expect(updated.name).toBe(toUpdate.name);
				expect(updated.position.x).toBe(toUpdate.position.x);
				expect(updated.position.y).toBe(toUpdate.position.y);

				// Check the data has still the same size
				const { data: after } = await service.findAndCount();
				expect(after).toHaveLength(before.length);

				// Check that the value returned in the list is equal to the one just updated
				const found = after.find(({ _id }) => _id === node._id);
				expect(found).toBeDefined();
				expect(updated.toJSON()).toStrictEqual(found!.toJSON());
			});
		});

		describe("Delete", () => {
			beforeEach(() => dbTest.refresh());

			it("should delete an entity", async () => {
				const [{ _id }] = graphNodes;
				const {
					pagination: { total: totalBefore }
				} = await service.findAndCount({ _id });
				expect(totalBefore).toBe(1);

				await service.delete(_id);
				const {
					pagination: { total: totalAfter }
				} = await service.findAndCount({ _id });
				expect(totalAfter).toBe(0);
			});

			it("should not delete an unknown id", async () => {
				const id = Math.max(...graphNodes.map(({ _id }) => _id)) + 1;
				await expect(service.delete(id)).rejects.toThrow(NotFoundError);
			});
		});
	});
});
