import { EntityRepository } from "@mikro-orm/core";

import { NodeInput } from "./node-input.entity";

/**
 * The repository to manage [node-inputs]{@link NodeInput}.
 */
export class NodeInputRepository extends EntityRepository<NodeInput> {}
