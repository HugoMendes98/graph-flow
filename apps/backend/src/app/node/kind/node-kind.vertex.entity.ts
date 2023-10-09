import { Embedded, Entity } from "@mikro-orm/core";
import { NodeKindVertexDto } from "~/lib/common/app/node/dtos/kind";
import { NodeKindType } from "~/lib/common/app/node/dtos/kind/node-kind.type";
import { EntityId } from "~/lib/common/dtos/entity";

import { NodeKindBaseEntity } from "./node-kind.base.entity";
import { ManyToOneFactory } from "../../_lib/entity/decorators";
import { GraphEntity } from "../../graph/graph.entity";
import { PositionEmbeddable } from "../position.embeddable";

/**
 * Type for this discriminated entity
 */
const type = NodeKindType.VERTEX;

/** @internal */
const GraphProperty = ManyToOneFactory(() => GraphEntity, {
	fieldName: "__graph" satisfies keyof NodeKindVertexDto,
	onUpdateIntegrity: "cascade"
});

/**
 * The entity for a `node-kind` of `VERTEX` type
 */
@Entity({ discriminatorValue: type })
export class NodeKindVertexEntity
	extends NodeKindBaseEntity<typeof NodeKindType.VERTEX>
	implements NodeKindVertexDto
{
	/** @inheritDoc */
	@GraphProperty({ foreign: false })
	public readonly __graph!: EntityId;

	/** @inheritDoc */
	@Embedded(() => PositionEmbeddable)
	public readonly position!: PositionEmbeddable;

	/** @inheritDoc */
	@GraphProperty({ foreign: true })
	public readonly graph?: GraphEntity;
}
