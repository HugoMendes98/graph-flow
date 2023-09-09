import { CategoryDto } from "../app/category/dtos";
import { GraphDto } from "../app/graph/dtos";
import { GraphArcDto } from "../app/graph/dtos/arc";
import { GraphNodeDto } from "../app/graph/dtos/node";
import { GraphNodeInputDto } from "../app/graph/dtos/node/input";
import { GraphNodeOutputDto } from "../app/graph/dtos/node/output";
import { NodeDto } from "../app/node/dtos";
import { NodeInputDto } from "../app/node/dtos/input";
import { NodeOutputDto } from "../app/node/dtos/output";
import { UserDto } from "../app/user/dtos";
import { WorkflowDto } from "../app/workflow/dtos";

/**
 * The values for a DB which all data is mocked
 */
export interface MockSeed {
	/**
	 * Represents the [category]{@link CategoryDto} table
	 */
	categories: readonly CategoryDto[];
	/**
	 * Graph domain related
	 */
	graph: {
		/**
		 * Represents the [graph-arc]{@link GraphArcDto} table
		 */
		graphArcs: readonly GraphArcDto[];
		/**
		 * Represents the [graph-node-input]{@link GraphNodeInputDto} table
		 */
		graphNodeInputs: ReadonlyArray<Omit<GraphNodeInputDto, "nodeInput">>;
		/**
		 * Represents the [graph-node-output]{@link GraphNodeOutputDto} table
		 */
		graphNodeOutputs: ReadonlyArray<Omit<GraphNodeOutputDto, "nodeOutput">>;
		/**
		 * Represents the [graph-node]{@link GraphNodeDto} table
		 */
		graphNodes: ReadonlyArray<Omit<GraphNodeDto, "inputs" | "node" | "outputs">>;
		/**
		 * Represents the [graph]{@link GraphDto} table
		 */
		graphs: readonly GraphDto[];
	};
	/**
	 * Node domain related
	 */
	node: {
		/**
		 * Represents the [node-input]{@link NodeInputDto} table
		 */
		nodeInputs: readonly NodeInputDto[];
		/**
		 * Represents the [node-output]{@link NodeOutputDto} table
		 */
		nodeOutputs: readonly NodeOutputDto[];
		/**
		 * Represents the [node]{@link NodeDto} table
		 */
		nodes: ReadonlyArray<
			Omit<NodeDto, "inputs" | "outputs"> & { __categories: readonly number[] }
		>;
	};
	/**
	 * Represents the [user]{@link UserDto} table
	 */
	users: ReadonlyArray<
		UserDto & {
			/**
			 * Clear password for seeding
			 */
			password: string;
		}
	>;
	/**
	 * Represents the [workflow]{@link WorkflowDto} table
	 */
	workflows: readonly WorkflowDto[];
}
