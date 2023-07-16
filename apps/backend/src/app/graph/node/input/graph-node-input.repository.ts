import { EntityRepository } from "@mikro-orm/core";

import { GraphNodeInput } from "./graph-node-input.entity";

/**
 * The repository to manage [graph-node-inputs]{@link GraphNodeInput}.
 */
export class GraphNodeInputRepository extends EntityRepository<GraphNodeInput> {}
