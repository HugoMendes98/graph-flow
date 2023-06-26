import { EntityRepository } from "@mikro-orm/core";

import { User } from "./user.entity";

/**
 * The repository to manage [users]{@link User}.
 */
export class UserRepository extends EntityRepository<User> {}
