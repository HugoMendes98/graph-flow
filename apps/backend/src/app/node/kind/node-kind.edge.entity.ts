import { Embedded, Entity } from "@mikro-orm/core";
import { NodeKindEdgeDto } from "~/lib/common/app/node/dtos/kind";
import { NodeKindType } from "~/lib/common/app/node/dtos/kind/node-kind.type";
import { EntityId } from "~/lib/common/dtos/entity";

import { NodeKindBaseEntity } from "./node-kind.base.entity";
import { ManyToOneFactory } from "../../_lib/entity/decorators";
import { GraphEntity } from "../../graph/graph.entity";
import { PositionEmbeddable } from "../position.embeddable";

/**
 * Type for this discriminated entity
 */
const type = NodeKindType.EDGE;

/** @internal */
const GraphProperty = ManyToOneFactory(() => GraphEntity, {
	fieldName: "__graph" satisfies keyof NodeKindEdgeDto,
	onUpdateIntegrity: "cascade"
});

/**
 * The entity for a `node-kind` of `EDGE` type
 */
@Entity({ discriminatorValue: type })
export class NodeKindEdgeEntity
	extends NodeKindBaseEntity<typeof NodeKindType.EDGE>
	implements NodeKindEdgeDto
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
