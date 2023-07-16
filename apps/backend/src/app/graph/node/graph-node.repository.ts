import { EntityRepository } from "@mikro-orm/core";

import { GraphNode } from "./graph-node.entity";

/**
 * The repository to manage [graph-nodes]{@link GraphNode}.
 */
export class GraphNodeRepository extends EntityRepository<GraphNode> {}
