import { EntityRepository } from "@mikro-orm/core";

import { GraphArcEntity } from "./graph-arc.entity";

/**
 * The repository to manage [graph-arcs]{@link GraphArcEntity}.
 */
export class GraphArcRepository extends EntityRepository<GraphArcEntity> {}
