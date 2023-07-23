import { Embedded, Entity, Property } from "@mikro-orm/core";
import { EntityId } from "~/lib/common/dtos/_lib/entity";
import { GraphNodeDto, GraphNodeRelationsDto } from "~/lib/common/dtos/graph/node";

import { GraphNodeRepository } from "./graph-node.repository";
import { PositionEmbeddable } from "./position.embeddable";
import { EntityBase, EntityWithRelations } from "../../_lib/entity";
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
export class GraphNode
	extends EntityBase
	implements EntityWithRelations<GraphNodeRelationsDto, { graph: Graph; node: Node }>
{
	@GraphProperty({ foreign: false })
	public __graph!: EntityId;
	@GraphProperty({ foreign: true })
	public graph?: Graph;

	@NodeProperty({ foreign: false })
	public __node!: EntityId;
	@NodeProperty({ foreign: true })
	public node?: Node;

	@Property()
	public name!: string;

	@Embedded(() => PositionEmbeddable)
	public position!: PositionEmbeddable;
}
