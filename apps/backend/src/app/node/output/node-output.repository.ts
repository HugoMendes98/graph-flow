import { EntityRepository } from "@mikro-orm/core";

import { NodeOutput } from "./node-output.entity";

/**
 * The repository to manage [node-outputs]{@link NodeOutput}.
 */
export class NodeOutputRepository extends EntityRepository<NodeOutput> {}
