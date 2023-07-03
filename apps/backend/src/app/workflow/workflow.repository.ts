import { EntityRepository } from "@mikro-orm/core";

import { Workflow } from "./workflow.entity";

/**
 * The repository to manage [workflows]{@link Workflow}.
 */
export class WorkflowRepository extends EntityRepository<Workflow> {}
