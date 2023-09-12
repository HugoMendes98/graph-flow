import { Embedded, Entity } from "@mikro-orm/core";
import { NodeKindEdgeDto, NodeKindType } from "~/lib/common/app/node/dtos/kind";
import { EntityId } from "~/lib/common/dtos/entity";

import { NodeKindBaseEntity } from "./node-kind.base.entity";
import { ManyToOneFactory } from "../../_lib/entity/decorators";
import { GraphEntity } from "../../graph/graph.entity";
import { PositionEmbeddable } from "../position.embeddable";

const type = NodeKindType.EDGE;

const GraphProperty = ManyToOneFactory(() => GraphEntity, {
	fieldName: "__graph" satisfies keyof NodeKindEdgeDto,
	onUpdateIntegrity: "cascade"
});

@Entity({ discriminatorValue: type })
export class NodeKindEdgeEntity
	extends NodeKindBaseEntity<typeof NodeKindType.EDGE>
	implements NodeKindEdgeDto
{
	/**
	 * @inheritDoc
	 */
	@GraphProperty({ foreign: false })
	public readonly __graph!: EntityId;

	/**
	 * @inheritDoc
	 */
	@Embedded(() => PositionEmbeddable)
	public readonly position!: PositionEmbeddable;

	/**
	 * @inheritDoc
	 */
	@GraphProperty({ foreign: true })
	public readonly graph?: GraphEntity;
}
