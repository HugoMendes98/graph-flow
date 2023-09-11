import { EntityRepository } from "@mikro-orm/core";

import { NodeEntity } from "./node.entity";

/**
 * The repository to manage [nodes]{@link NodeEntity}.
 */
export class NodeRepository extends EntityRepository<NodeEntity> {}
