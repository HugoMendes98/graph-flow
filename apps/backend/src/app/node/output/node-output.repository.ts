import { EntityRepository } from "@mikro-orm/core";

import { NodeOutputEntity } from "./node-output.entity";

/**
 * The repository to manage [node-outputs]{@link NodeOutputEntity}.
 */
export class NodeOutputRepository extends EntityRepository<NodeOutputEntity> {}
