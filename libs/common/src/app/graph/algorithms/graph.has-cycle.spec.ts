import { graphHasCycle } from "./graph.has-cycle";
import {
	AdjacencyListTransformationParams,
	getAdjacencyList
} from "../transformations";

describe("graphHasCycle", () => {
	it("should not have a cycle", () => {
		const graphs: AdjacencyListTransformationParams[] = [
			// "Empty" graphs
			{ arcs: [], nodes: [] },
			{
				arcs: [],
				nodes: [
					{ inputs: [], outputs: [] },
					{ inputs: [], outputs: [] }
				]
			},
			{
				arcs: [],
				nodes: [
					{ inputs: [{ _id: 1 }], outputs: [{ _id: 2 }] },
					{ inputs: [{ _id: 3 }], outputs: [{ _id: 4 }] }
				]
			},

			{
				arcs: [{ __from: 1, __to: 2 }],
				nodes: [
					{ inputs: [], outputs: [{ _id: 1 }] },
					{ inputs: [{ _id: 2 }], outputs: [] }
				]
			},
			{
				arcs: [
					{ __from: 11, __to: 20 },
					{ __from: 11, __to: 21 },
					{ __from: 11, __to: 30 },
					{ __from: 22, __to: 31 }
				],
				nodes: [
					{ inputs: [{ _id: 10 }], outputs: [{ _id: 11 }] },
					{
						inputs: [{ _id: 20 }, { _id: 21 }],
						outputs: [{ _id: 22 }]
					},
					{ inputs: [{ _id: 30 }, { _id: 31 }], outputs: [] }
				]
			},
			{
				arcs: [
					{ __from: 1, __to: 2 },

					{ __from: 11, __to: 20 }
				],
				nodes: [
					{ inputs: [], outputs: [{ _id: 1 }] },
					{ inputs: [{ _id: 2 }], outputs: [] },

					// Not connected to the previous nodes
					{ inputs: [], outputs: [{ _id: 11 }] },
					{ inputs: [{ _id: 20 }], outputs: [] }
				]
			},

			{
				arcs: [
					{ __from: 10, __to: 10 },
					{ __from: 20, __to: 20 }
				],
				nodes: [
					{ inputs: [], outputs: [{ _id: 10 }] },
					{ inputs: [], outputs: [{ _id: 20 }] },
					{ inputs: [{ _id: 10 }, { _id: 20 }], outputs: [] }
				]
			},
			{
				arcs: [
					{ __from: 10, __to: 21 },
					{ __from: 10, __to: 10 },
					{ __from: 20, __to: 20 }
				],
				nodes: [
					{ inputs: [], outputs: [{ _id: 10 }] },
					{ inputs: [{ _id: 10 }], outputs: [{ _id: 20 }] },
					{ inputs: [{ _id: 20 }, { _id: 21 }], outputs: [] }
				]
			}
		];

		for (const graph of graphs) {
			expect(graphHasCycle(getAdjacencyList(graph))).toBe(false);
		}
	});

	it("should have a cycle", () => {
		const graphs: AdjacencyListTransformationParams[] = [
			{
				arcs: [{ __from: 2, __to: 1 }],
				nodes: [{ inputs: [{ _id: 1 }], outputs: [{ _id: 2 }] }]
			},
			{
				arcs: [
					{ __from: 11, __to: 20 },
					{ __from: 21, __to: 10 }
				],
				nodes: [
					{ inputs: [{ _id: 10 }], outputs: [{ _id: 11 }] },
					{ inputs: [{ _id: 20 }], outputs: [{ _id: 21 }] }
				]
			},
			{
				arcs: [
					{ __from: 11, __to: 20 },
					{ __from: 11, __to: 30 },
					{ __from: 22, __to: 30 },
					{ __from: 22, __to: 31 },
					{ __from: 32, __to: 10 }
				],
				nodes: [
					{ inputs: [{ _id: 10 }], outputs: [{ _id: 11 }] },
					{ inputs: [{ _id: 20 }], outputs: [{ _id: 22 }] },
					{
						inputs: [{ _id: 30 }, { _id: 31 }],
						outputs: [{ _id: 32 }]
					}
				]
			},
			{
				arcs: [
					{ __from: 1, __to: 2 },

					{ __from: 11, __to: 20 },
					{ __from: 21, __to: 10 }
				],
				nodes: [
					{ inputs: [], outputs: [{ _id: 1 }] },
					{ inputs: [{ _id: 2 }], outputs: [] },

					// Not connected to the previous nodes
					{ inputs: [{ _id: 10 }], outputs: [{ _id: 11 }] },
					{ inputs: [{ _id: 20 }], outputs: [{ _id: 21 }] }
				]
			}
		];

		for (const graph of graphs) {
			expect(graphHasCycle(getAdjacencyList(graph))).toBe(true);
		}
	});
});
