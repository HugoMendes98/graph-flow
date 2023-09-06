import { EntityRepository } from "@mikro-orm/core";

import { GraphNodeOutput } from "./graph-node-output.entity";

/**
 * The repository to manage [graph-node-output]{@link GraphNodeOutput}.
 */
export class GraphNodeOutputRepository extends EntityRepository<GraphNodeOutput> {}
