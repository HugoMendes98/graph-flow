import { EntityRepository } from "@mikro-orm/core";

import { Node } from "./node.entity";

/**
 * The repository to manage [nodes]{@link Node}.
 */
export class NodeRepository extends EntityRepository<Node> {}
