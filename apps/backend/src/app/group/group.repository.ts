import { EntityRepository } from "@mikro-orm/core";

import { Group } from "./group.entity";

/**
 * The repository to manage [groups]{@link Group}.
 */
export class GroupRepository extends EntityRepository<Group> {}
