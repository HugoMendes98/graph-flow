import { AdjacencyListUnlinkedArcException } from "./get-adjacency-list.exceptions";
import {
	AdjacencyListLink,
	AdjacencyListTransformationParams,
	getAdjacencyList
} from "./get-adjacency.list";

describe("getAdjacencyList", () => {
	it("should return an empty list", () => {
		expect(getAdjacencyList({ arcs: [], nodes: [] }).size).toBe(0);
	});

	it("should return an adjacency list with no adjacent", () => {
		const graph = {
			arcs: [],
			nodes: [
				// Node A
				{ inputs: [{ _id: 10 }], outputs: [{ _id: 10 }] },
				// Node B
				{ inputs: [{ _id: 20 }], outputs: [{ _id: 20 }] },
				// Node C
				{ inputs: [{ _id: 30 }], outputs: [{ _id: 30 }] },
				// Node D
				{ inputs: [{ _id: 40 }], outputs: [{ _id: 40 }] },
				// Node E
				{ inputs: [{ _id: 50 }], outputs: [{ _id: 50 }] }
			]
		} as const satisfies AdjacencyListTransformationParams;

		const list = Array.from(getAdjacencyList(graph).values());

		expect(list).toHaveLength(graph.nodes.length);
		expect(
			list.every(
				({ adjacentBy, adjacentTo }) =>
					adjacentBy.length === 0 && adjacentTo.length === 0
			)
		).toBe(true);
	});

	it("should return an adjacency list (simple)", () => {
		const graph = {
			arcs: [
				// 0: A -> B
				{ __from: 10, __to: 20 },
				// 1: A -> C
				{ __from: 10, __to: 30 },
				// 2: A -> C
				{ __from: 11, __to: 31 },
				// 3: B -> D
				{ __from: 20, __to: 40 },
				// 4: C -> A (cycle)
				{ __from: 30, __to: 10 },
				// 5: C -> E
				{ __from: 31, __to: 50 },
				// 6: C -> E
				{ __from: 31, __to: 51 },
				// 7: D -> C (cycle)
				{ __from: 40, __to: 31 },
				// 8: D -> E
				{ __from: 40, __to: 50 },
				// 9: E -> E (cycle)
				{ __from: 50, __to: 51 }
			],
			nodes: [
				// Node A
				{ inputs: [{ _id: 10 }], outputs: [{ _id: 10 }, { _id: 11 }] },
				// Node B
				{ inputs: [{ _id: 20 }], outputs: [{ _id: 20 }, { _id: 21 }] },
				// Node C
				{
					inputs: [{ _id: 30 }, { _id: 31 }],
					outputs: [{ _id: 30 }, { _id: 31 }]
				},
				// Node D
				{ inputs: [{ _id: 40 }], outputs: [{ _id: 40 }] },
				// Node E
				{ inputs: [{ _id: 50 }, { _id: 51 }], outputs: [{ _id: 50 }] }
			]
		} as const satisfies AdjacencyListTransformationParams;

		const list = getAdjacencyList(graph);

		const { arcs, nodes } = graph;
		expect(list.size).toBe(nodes.length);

		for (const node of nodes) {
			const adItem = list.get(node)!;

			// reference check
			expect(adItem.node).toBe(node);

			// Verify direction
			for (const by of adItem.adjacentBy) {
				expect(by.to.node).toBe(node);
			}
			for (const to of adItem.adjacentTo) {
				expect(to.from.node).toBe(node);
			}
		}

		const [nodeA, nodeB, nodeC, nodeD, nodeE] = nodes;

		// As the order is not guaranteed
		const sortAdjacency = (
			{ arc: a }: AdjacencyListLink,
			{ arc: b }: AdjacencyListLink
		) => (a.__from === b.__from ? a.__to - b.__to : a.__from - b.__from);

		{
			// NodeA Adjacency
			const { adjacentBy, adjacentTo } = list.get(nodeA)!;
			expect(adjacentBy).toHaveLength(1);
			expect(adjacentTo).toHaveLength(3);

			const [byC] = adjacentBy.slice().sort(sortAdjacency);
			expect(byC.arc).toBe(arcs[4]);
			expect(byC.from.node).toBe(nodes[2]);

			const [toB, toC1, toC2] = adjacentTo.slice().sort(sortAdjacency);
			expect(toB.arc).toBe(arcs[0]);
			expect(toB.to.node).toBe(nodes[1]);
			expect(toC1.arc).toBe(arcs[1]);
			expect(toC1.to.node).toBe(nodes[2]);
			expect(toC2.arc).toBe(arcs[2]);
			expect(toC2.to.node).toBe(nodes[2]);
		}

		{
			// NodeB Adjacency
			const { adjacentBy, adjacentTo } = list.get(nodeB)!;
			expect(adjacentBy).toHaveLength(1);
			expect(adjacentTo).toHaveLength(1);

			const [byA] = adjacentBy.slice().sort(sortAdjacency);
			expect(byA.arc).toBe(arcs[0]);
			expect(byA.from.node).toBe(nodes[0]);

			const [toD] = adjacentTo.slice().sort(sortAdjacency);
			expect(toD.arc).toBe(arcs[3]);
			expect(toD.to.node).toBe(nodes[3]);
		}

		{
			// NodeC Adjacency
			const { adjacentBy, adjacentTo } = list.get(nodeC)!;
			expect(adjacentBy).toHaveLength(3);
			expect(adjacentTo).toHaveLength(3);

			const [byA1, byA2, byD] = adjacentBy.slice().sort(sortAdjacency);
			expect(byA1.arc).toBe(arcs[1]);
			expect(byA1.from.node).toBe(nodes[0]);
			expect(byA2.arc).toBe(arcs[2]);
			expect(byA2.from.node).toBe(nodes[0]);
			expect(byD.arc).toBe(arcs[7]);
			expect(byD.from.node).toBe(nodes[3]);

			const [toA, toE1, toE2] = adjacentTo.slice().sort(sortAdjacency);
			expect(toA.arc).toBe(arcs[4]);
			expect(toA.to.node).toBe(nodes[0]);
			expect(toE1.arc).toBe(arcs[5]);
			expect(toE1.to.node).toBe(nodes[4]);
			expect(toE2.arc).toBe(arcs[6]);
			expect(toE2.to.node).toBe(nodes[4]);
		}

		{
			// NodeD Adjacency
			const { adjacentBy, adjacentTo } = list.get(nodeD)!;
			expect(adjacentBy).toHaveLength(1);
			expect(adjacentTo).toHaveLength(2);

			const [byB] = adjacentBy.slice().sort(sortAdjacency);
			expect(byB.arc).toBe(arcs[3]);
			expect(byB.from.node).toBe(nodes[1]);

			const [toC, toE] = adjacentTo.slice().sort(sortAdjacency);
			expect(toC.arc).toBe(arcs[7]);
			expect(toC.to.node).toBe(nodes[2]);
			expect(toE.arc).toBe(arcs[8]);
			expect(toE.to.node).toBe(nodes[4]);
		}

		{
			// NodeE Adjacency
			const { adjacentBy, adjacentTo } = list.get(nodeE)!;
			expect(adjacentBy).toHaveLength(4);
			expect(adjacentTo).toHaveLength(1);

			const [byC1, byC2, byD, byE] = adjacentBy
				.slice()
				.sort(sortAdjacency);
			expect(byC1.arc).toBe(arcs[5]);
			expect(byC1.from.node).toBe(nodes[2]);
			expect(byC2.arc).toBe(arcs[6]);
			expect(byC2.from.node).toBe(nodes[2]);
			expect(byD.arc).toBe(arcs[8]);
			expect(byD.from.node).toBe(nodes[3]);
			expect(byE.arc).toBe(arcs[9]);
			expect(byE.from.node).toBe(nodes[4]);

			const [toE] = adjacentTo.slice().sort(sortAdjacency);
			expect(toE.arc).toBe(arcs[9]);
			expect(toE.to.node).toBe(nodes[4]);
		}
	});

	it("should fail when an arc does not connect 2 nodes", () => {
		expect(() =>
			getAdjacencyList({ arcs: [{ __from: 2, __to: 1 }], nodes: [] })
		).toThrow(AdjacencyListUnlinkedArcException);

		expect(() =>
			getAdjacencyList({
				arcs: [
					{ __from: 2, __to: 1 },
					{ __from: 1, __to: 2 },
					{ __from: 3, __to: 1 },
					{ __from: 1, __to: 1 },
					{ __from: 2, __to: 2 }
				],
				nodes: [
					{
						inputs: [{ _id: 1 }, { _id: 2 }],
						outputs: [{ _id: 1 }, { _id: 2 }]
					}
				]
			})
		).toThrow(AdjacencyListUnlinkedArcException);
	});
});
