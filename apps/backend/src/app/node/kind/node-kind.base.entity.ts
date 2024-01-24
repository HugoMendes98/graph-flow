import { Entity, Enum, OneToOne } from "@mikro-orm/core";
import {
	NodeKindBaseDto,
	NodeKindDiscriminatorKey
} from "~/lib/common/app/node/dtos/kind";
import { NodeKindType } from "~/lib/common/app/node/dtos/kind/node-kind.type";

import { NodeEntity } from "../node.entity";

/**
 * The basic entity for a `node-kind`
 *
 * @abstract
 */
@Entity({
	abstract: true,
	discriminatorColumn: "type" satisfies NodeKindDiscriminatorKey,
	tableName: "node_kind"
})
export class NodeKindBaseEntity<Type extends NodeKindType = NodeKindType>
	implements NodeKindBaseDto
{
	@Enum({ items: () => NodeKindType, type: () => NodeKindType })
	public readonly type!: Type;

	// The owing side is here, so the primary key is also the foreign key
	@OneToOne(() => NodeEntity, {
		eager: false,
		hidden: true,
		onDelete: "cascade",
		onUpdateIntegrity: "cascade",
		owner: true,
		primary: true
	})
	public readonly node?: NodeEntity;
}
