import { CategoryDto } from "../app/category/dtos";
import { GraphDto } from "../app/graph/dtos";
import { GraphArcDto } from "../app/graph/dtos/arc";
import { NodeDto } from "../app/node/dtos";
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
		arcs: readonly GraphArcDto[];
		/**
		 * Represents the [graph]{@link GraphDto} table
		 */
		graphs: readonly GraphDto[];
		/**
		 * Represents the [node]{@link NodeDto} table
		 */
		nodes: ReadonlyArray<NodeDto & { __categories: readonly number[] }>;
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
