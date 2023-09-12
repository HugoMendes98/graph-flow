import { EntityRepository } from "@mikro-orm/core";

import { GraphEntity } from "./graph.entity";

/**
 * The repository to manage [graphs]{@link GraphEntity}.
 */
export class GraphRepository extends EntityRepository<GraphEntity> {}
