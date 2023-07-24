import { Embedded, Entity, Property } from "@mikro-orm/core";
import { EntityId } from "~/lib/common/dtos/_lib/entity";
import { DtoToEntity } from "~/lib/common/dtos/_lib/entity/entity.types";
import { GraphNodeDto } from "~/lib/common/dtos/graph/node";

import { GraphNodeRepository } from "./graph-node.repository";
import { PositionEmbeddable } from "./position.embeddable";
import { EntityBase } from "../../_lib/entity";
import { ManyToOneFactory } from "../../_lib/entity/decorators";
import { Node } from "../../node/node.entity";
import { Graph } from "../graph.entity";

const GraphProperty = ManyToOneFactory(() => Graph, {
	fieldName: "__graph" satisfies keyof GraphNodeDto,
	onUpdateIntegrity: "cascade"
});

const NodeProperty = ManyToOneFactory(() => Node, {
	fieldName: "__node" satisfies keyof GraphNodeDto,
	onUpdateIntegrity: "cascade"
});

@Entity({ customRepository: () => GraphNodeRepository })
export class GraphNode extends EntityBase implements DtoToEntity<GraphNodeDto> {
	@GraphProperty({ foreign: false })
	public __graph!: EntityId;

	@NodeProperty({ foreign: false })
	public __node!: EntityId;

	@Property()
	public name!: string;

	@Embedded(() => PositionEmbeddable)
	public position!: PositionEmbeddable;

	// ------- Relations -------

	@GraphProperty({ foreign: true })
	public readonly graph?: Graph;

	@NodeProperty({ foreign: true })
	public readonly node?: Node;
}
