import { EntityRepository } from "@mikro-orm/core";

import { Graph } from "./graph.entity";

/**
 * The repository to manage [graphs]{@link Graph}.
 */
export class GraphRepository extends EntityRepository<Graph> {}
