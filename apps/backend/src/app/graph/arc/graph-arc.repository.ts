import { EntityRepository } from "@mikro-orm/core";

import { GraphArc } from "./graph-arc.entity";

/**
 * The repository to manage [graph-arcs]{@link GraphArc}.
 */
export class GraphArcRepository extends EntityRepository<GraphArc> {}
