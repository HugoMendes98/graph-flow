import { Entity, Property } from "@mikro-orm/core";
import { NodeKindTemplateDto } from "~/lib/common/app/node/dtos/kind";
import { NodeKindType } from "~/lib/common/app/node/dtos/kind/node-kind.type";

import { NodeKindBaseEntity } from "./node-kind.base.entity";

/**
 * Type for this discriminated entity
 */
const type = NodeKindType.TEMPLATE;

/**
 * The entity for a `node-kind` of `TEMPLATE` type
 */
@Entity({ discriminatorValue: type })
export class NodeKindTemplateEntity
	extends NodeKindBaseEntity<typeof type>
	implements NodeKindTemplateDto
{
	/** @inheritDoc */
	@Property({ default: false, nullable: false })
	public active!: boolean;
}
