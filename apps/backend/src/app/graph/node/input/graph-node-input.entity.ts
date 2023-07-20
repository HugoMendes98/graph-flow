import { Entity } from "@mikro-orm/core";
import { GraphNodeRelationsDto } from "~/lib/common/dtos/graph/node";
import { GraphNodeInputDto, GraphNodeInputRelationsDto } from "~/lib/common/dtos/graph/node/input";
import { NodeInputRelationsDto } from "~/lib/common/dtos/node/input";

import { GraphNodeInputRepository } from "./graph-node-input.repository";
import { EntityBase, EntityWithRelations } from "../../../_lib/entity";
import { ManyToOneFactory } from "../../../_lib/entity/decorators";
import { NodeInput } from "../../../node/input";
import { GraphNode } from "../graph-node.entity";

const GraphNodeProperty = ManyToOneFactory(() => GraphNode, {
	fieldName: "__graph_node" satisfies keyof GraphNodeInputDto,
	onUpdateIntegrity: "cascade"
});

const NodeInputProperty = ManyToOneFactory(() => NodeInput, {
	fieldName: "__graph_node" satisfies keyof GraphNodeInputDto,
	onUpdateIntegrity: "cascade"
});

@Entity({ customRepository: () => GraphNodeInputRepository })
export class GraphNodeInput
	extends EntityBase
	implements EntityWithRelations<GraphNodeInputRelationsDto>
{
	@GraphNodeProperty({ foreign: false })
	public __graph_node!: number;
	@GraphNodeProperty({ foreign: true })
	public graphNode?: GraphNodeRelationsDto;

	@NodeInputProperty({ foreign: false })
	public __node_input!: number;
	@NodeInputProperty({ foreign: true })
	public nodeInput?: NodeInputRelationsDto;
}
