import { EntityRepository } from "@mikro-orm/core";

import { NodeInputEntity } from "./node-input.entity";

/**
 * The repository to manage [node-inputs]{@link NodeInputEntity}.
 */
export class NodeInputRepository extends EntityRepository<NodeInputEntity> {}
