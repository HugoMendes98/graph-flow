import {
	ForeignKeyConstraintViolationException,
	NotFoundError,
	UniqueConstraintViolationException
} from "@mikro-orm/core";
import { MethodNotAllowedException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { GraphArcCreateDto } from "~/lib/common/app/graph/dtos/arc";
import { NodeBehaviorType } from "~/lib/common/app/node/dtos/behaviors/node-behavior.type";
import { NodeKindType } from "~/lib/common/app/node/dtos/kind/node-kind.type";
import { BASE_SEED, MockSeed } from "~/lib/common/seeds";

import { GraphArcDifferentGraphException } from "./exceptions";
import { GraphArcService } from "./graph-arc.service";
import { DbTestHelper } from "../../../../test/db-test";
import { OrmModule } from "../../../orm/orm.module";
import { NodeService } from "../../node/node.service";
import { GraphCyclicException } from "../exceptions";
import { GraphModule } from "../graph.module";

describe("GraphArcService", () => {
	let dbTest: DbTestHelper;
	let service: GraphArcService;
	let nodeService: NodeService;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [OrmModule, GraphModule],
			providers: []
		}).compile();

		dbTest = new DbTestHelper(module);
		service = module.get(GraphArcService);
		nodeService = module.get(NodeService);
	});

	afterAll(() => dbTest.close());

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("With Input/Outputs", () => {
		let db: typeof BASE_SEED.graph;

		// Small seed in the empty graph
		const seed = async () => {
			const graph = db.graphs[2];
			const [var1, var2, , , nCode] = db.nodes;

			const variable1 = await nodeService.create(
				{
					behavior: {
						__node: var1._id,
						type: NodeBehaviorType.REFERENCE
					},
					kind: {
						__graph: graph._id,
						position: { x: 0, y: 0 },
						type: NodeKindType.VERTEX
					},
					name: "Var1"
				},
				{ findOptions: { populate: { inputs: true, outputs: true } } }
			);
			const variable2 = await nodeService.create(
				{
					behavior: {
						__node: var2._id,
						type: NodeBehaviorType.REFERENCE
					},
					kind: {
						__graph: graph._id,
						position: { x: 0, y: 0 },
						type: NodeKindType.VERTEX
					},
					name: "Var2"
				},
				{ findOptions: { populate: { inputs: true, outputs: true } } }
			);
			const code = await nodeService.create(
				{
					behavior: {
						__node: nCode._id,
						type: NodeBehaviorType.REFERENCE
					},
					kind: {
						__graph: graph._id,
						position: { x: 0, y: 0 },
						type: NodeKindType.VERTEX
					},
					name: "code"
				},
				{ findOptions: { populate: { inputs: true, outputs: true } } }
			);

			return { code, variable1, variable2 };
		};

		beforeEach(() => {
			db = dbTest.db.graph as never;
			return dbTest.refresh();
		});

		it("should fail when the input is unknown", async () => {
			const {
				code: {
					outputs: [output]
				}
			} = await seed();

			const __to =
				Math.max(
					...(db.nodes as MockSeed["graph"]["nodes"]).flatMap(
						({ inputs }) => inputs.map(({ _id }) => _id)
					)
				) * 2;
			await expect(() =>
				service.create({ __from: output._id, __to })
			).rejects.toThrow(ForeignKeyConstraintViolationException);
		});

		it("should fail when the output is unknown", async () => {
			const {
				code: {
					inputs: [input]
				}
			} = await seed();

			const __from =
				Math.max(
					...(db.nodes as MockSeed["graph"]["nodes"]).flatMap(
						({ outputs }) => outputs.map(({ _id }) => _id)
					)
				) * 2;
			await expect(() =>
				service.create({ __from, __to: input._id })
			).rejects.toThrow(ForeignKeyConstraintViolationException);
		});

		it("should fail when the input is already used", async () => {
			const {
				code: {
					inputs: [input]
				},
				variable1: {
					outputs: [output1]
				},
				variable2: {
					outputs: [output2]
				}
			} = await seed();

			await service.create({ __from: output1._id, __to: input._id });
			await expect(() =>
				service.create({ __from: output2._id, __to: input._id })
			).rejects.toThrow(UniqueConstraintViolationException);
		});

		it("should fail when the input and output are not from the same graph", async () => {
			const {
				code: {
					inputs: [input]
				}
			} = await seed();

			const {
				outputs: [output]
			} = await nodeService.findById(db.nodes[0]._id);

			await expect(() =>
				service.create({ __from: output._id, __to: input._id })
			).rejects.toThrow(GraphArcDifferentGraphException);
		});

		it("should fail when it forms a cycle in the graph (same graph-node)", async () => {
			const {
				code: {
					inputs: [cInput],
					outputs: [cOutput]
				}
			} = await seed();

			// code -> code
			await expect(() =>
				service.create({ __from: cOutput._id, __to: cInput._id })
			).rejects.toThrow(GraphCyclicException);
		});

		it("should fail when it forms a cycle in the graph", async () => {
			const {
				code: {
					inputs: [cInput],
					outputs: [cOutput]
				},
				variable1: {
					inputs: [vInput],
					outputs: [vOutput]
				}
			} = await seed();

			// variable -> code
			await service.create({ __from: vOutput._id, __to: cInput._id });

			// code -> variable => cyclic : variable -> code -> variable
			await expect(() =>
				service.create({ __from: cOutput._id, __to: vInput._id })
			).rejects.toThrow(GraphCyclicException);
		});

		it("should not detect a cycle in the graph", async () => {
			const {
				code: {
					inputs: [cInput1, cInput2]
				},
				variable1: {
					outputs: [v1Output]
				},
				variable2: {
					inputs: [v2Input],
					outputs: [v2Output]
				}
			} = await seed();

			// variable1 -> variable2
			await service.create({ __from: v1Output._id, __to: v2Input._id });
			// variable2 -> code
			await service.create({ __from: v2Output._id, __to: cInput1._id });
			// variable1 -> code
			await expect(
				service.create({ __from: v1Output._id, __to: cInput2._id })
			).resolves.not.toThrow();
		});
	});

	describe("CRUD basic", () => {
		let graphArcs: typeof dbTest.db.graph.arcs;

		beforeEach(() => {
			graphArcs = dbTest.db.graph.arcs;
		});

		describe("Read", () => {
			beforeEach(() => dbTest.refresh());

			it("should get one", async () => {
				for (const arc of graphArcs) {
					const row = await service.findById(arc._id);
					expect(row.toJSON()).toStrictEqual(arc);
				}
			});

			it("should fail when getting one by an unknown id", async () => {
				const id = Math.max(...graphArcs.map(({ _id }) => _id)) + 1;
				await expect(service.findById(id)).rejects.toThrow(
					NotFoundError
				);
			});
		});

		describe("Create", () => {
			beforeEach(() => dbTest.refresh());

			it("should add a new entity", async () => {
				const { __from, __to } = await service.delete(graphArcs[0]._id);

				const { data: before } = await service.findAndCount();
				const toCreate: GraphArcCreateDto = { __from, __to };
				const created = await service.create(toCreate);
				expect(created.__from).toBe(toCreate.__from);
				expect(created.__to).toBe(toCreate.__to);

				// Check that the entity is in the data (should have one more than before)
				const { data: after } = await service.findAndCount();
				expect(after).toHaveLength(before.length + 1);

				// Check that the value returned in the list is equal to the one just created
				const found = after.find(({ _id }) => _id === created._id);
				expect(found).toBeDefined();
				expect(created.toJSON()).toStrictEqual(found!.toJSON());
			});

			it("should fail when a uniqueness constraint is not respected", async () => {
				const [{ __to }] = graphArcs;

				await expect(() =>
					service.create({ __from: 123123, __to })
				).rejects.toThrow(UniqueConstraintViolationException);
			});
		});

		describe("Update", () => {
			it("should fail when updated a graph-arc", async () => {
				await expect(() =>
					service.update(graphArcs[0]._id, {})
				).rejects.toThrow(MethodNotAllowedException);
			});
		});

		describe("Delete", () => {
			beforeEach(() => dbTest.refresh());

			it("should delete an entity", async () => {
				const [{ _id }] = graphArcs;
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
				const id = Math.max(...graphArcs.map(({ _id }) => _id)) + 1;
				await expect(service.delete(id)).rejects.toThrow(NotFoundError);
			});
		});
	});
});
