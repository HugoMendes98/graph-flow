import {
	lastValueFrom,
	Observable,
	ReplaySubject,
	Subscription,
	takeWhile
} from "rxjs";
import { match, P } from "ts-pattern";
import {
	AdjacencyListArc,
	AdjacencyListItem
} from "~/lib/common/app/graph/transformations";
import { NodeDto } from "~/lib/common/app/node/dtos";
import { NodeIoValue } from "~/lib/common/app/node/io";
import { EntityId } from "~/lib/common/dtos/entity";

import { GraphExecuteOptions } from "./graph.executor";
import { GraphExecuteState } from "./graph.executor.state";
import { NodeExecutor } from "../../node/executor/node.executor";
import { NodeEntity } from "../../node/node.entity";

/**
 * The kind of Node wanted for the Graph resolver
 */
export interface GraphResolverNode extends NodeDto {
	/**
	 * The entity object of the Node
	 * Note: for NodeExecutor compatibility
	 */
	entity: NodeEntity;
}

/**
 * The initials nodes for the resolver.
 * They are supposed to come from an AdjacencyList Object.
 */
export type GraphResolverRoot = AdjacencyListItem<
	AdjacencyListArc,
	GraphResolverNode
>;

/**
 * Internal for the {@link GraphExecutor}.
 */
export class GraphResolver {
	/**
	 * Observable of the executed graph state
	 */
	public readonly state$: Observable<GraphExecuteState>;

	private readonly state = new ReplaySubject<GraphExecuteState>();
	private readonly inputs: Map<EntityId, NodeIoValue>;

	// Note: this could be removed and always use the ReplaySubject to check the state.
	//  But it would be a `O(n)` (for each state) instead of a `O(log(n))`
	/** More like a resolving or resolved set */
	private readonly resolved = new Set<NodeEntity>();
	/** More like a propagating or propagated set */
	private readonly propagated = new Set<NodeEntity>();

	/** Subscription of the internal state to update the sets above */
	private readonly subscription: Subscription;

	/**
	 * Creates a resolver for a graph
	 *
	 * @param nodeExecutor to execute the nodes
	 * @param roots staring nodes of the propagation
	 * @param inputs initials inputs (the ids of the node-inputs and their value)
	 * @param options Execution options
	 */
	public constructor(
		private readonly nodeExecutor: NodeExecutor,
		private readonly roots: GraphResolverRoot[],
		inputs: ReadonlyMap<EntityId, NodeIoValue>,
		options: GraphExecuteOptions = {}
	) {
		this.inputs = new Map(inputs);
		this.state$ = this.state.asObservable();

		this.subscription = this.state$.subscribe(state =>
			match(state)
				.with({ type: "resolution-start" }, ({ node }) =>
					this.resolved.add(node)
				)
				.with({ type: "propagation-enter" }, ({ node }) =>
					this.propagated.add(node)
				)
				.with(
					{ type: P.union("propagation-leave", "resolution-end") },
					() => void 0
				)
				.exhaustive()
		);
	}

	/**
	 * `Executes` resolves the graph while executing the encountered nodes
	 *
	 * @returns Promise when finished
	 */
	public execute() {
		return Promise.all(this.roots.map(root => this.propagate(root)))
			.then(() => this.state.complete())
			.catch((error: unknown) => this.state.error(error))
			.finally(() => this.clean());
	}

	// TODO: a destroy function ?
	// When a workflow is canceled

	private clean() {
		this.subscription.unsubscribe();
	}

	private async resolve(node: GraphResolverRoot) {
		const { entity } = node.node;

		if (this.resolved.has(entity)) {
			// Either being or completely executed
			await this.waitForResolve(node);
			return;
		}

		this.state.next({ node: entity, type: "resolution-start" });

		const parents = node.adjacentBy.map(({ from }) => from);
		await Promise.all(parents.map(parent => this.resolve(parent)));

		// State emitted here, so the 2 events are close
		const outputs = await this.executeNode(node);
		this.state.next({ node: entity, outputs, type: "resolution-end" });
	}

	private async propagate(node: GraphResolverRoot) {
		// Always call `resolve` first
		//  It could even wait for another propagation
		await this.resolve(node);
		if (this.propagated.has(node.node.entity)) {
			// It happens when 2 nodes propagates to the same one.
			// Only the first reached is considered has propagated
			return;
		}

		this.state.next({ node: node.node.entity, type: "propagation-enter" });

		const children = node.adjacentTo.map(({ to }) => to);
		await Promise.all(children.map(child => this.propagate(child)));

		this.state.next({ node: node.node.entity, type: "propagation-leave" });
	}

	private async executeNode(node: GraphResolverRoot) {
		// TODO: timeout
		const outputs = await this.nodeExecutor.execute({
			node: node.node.entity,
			valuedInputs: this.inputs
		});

		for (const { arc } of node.adjacentTo) {
			// TODO: a better/cleaner way?
			for (const { output, value } of outputs) {
				if (output._id === arc.__from) {
					this.inputs.set(arc.__to, value);
				}
			}
		}

		return outputs;
	}

	private waitForResolve({ node }: GraphResolverRoot) {
		// This works cause ReplaySubject returns all states on subscription
		return lastValueFrom(
			this.state$.pipe(
				takeWhile(
					({ node: { _id }, type }) =>
						!(type === "resolution-end" && _id === node._id)
				)
			)
		).then();
	}
}
