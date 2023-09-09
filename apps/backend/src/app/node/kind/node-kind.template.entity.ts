import { Entity } from "@mikro-orm/core";
import { NodeKindTemplateDto, NodeKindType } from "~/lib/common/app/node/dtos/kind";

import { NodeKindBaseEntity } from "./node-kind.base.entity";

const type = NodeKindType.TEMPLATE;

@Entity({ discriminatorValue: type })
export class NodeKindTemplateEntity
	extends NodeKindBaseEntity<typeof type>
	implements NodeKindTemplateDto {}
