import { Entity } from "@mikro-orm/core";
import { GraphNodeOutputRelationsDto } from "~/lib/common/dtos/graph/node/output";

import { GraphNodeOutputRepository } from "./graph-node-output.repository";
import { EntityBase, EntityWithRelations } from "../../../_lib/entity";
import { ManyToOneFactory } from "../../../_lib/entity/decorators";
import { NodeOutput } from "../../../node/output";
import { GraphNode } from "../graph-node.entity";

const GraphNodeProperty = ManyToOneFactory(() => GraphNode, {
	fieldName: "__graph_node" satisfies keyof GraphNodeOutputRelationsDto,
	onUpdateIntegrity: "cascade"
});

const NodeOutputProperty = ManyToOneFactory(() => NodeOutput, {
	fieldName: "__graph_node" satisfies keyof GraphNodeOutputRelationsDto,
	onUpdateIntegrity: "cascade"
});

@Entity({ customRepository: () => GraphNodeOutputRepository })
export class GraphNodeOutput
	extends EntityBase
	implements
		EntityWithRelations<
			GraphNodeOutputRelationsDto,
			{ graphNode: GraphNode; nodeOutput: NodeOutput }
		>
{
	@GraphNodeProperty({ foreign: false })
	public __graph_node!: number;
	@GraphNodeProperty({ foreign: true })
	public graphNode?: GraphNode;

	@NodeOutputProperty({ foreign: false })
	public __node_output!: number;
	@NodeOutputProperty({ foreign: true })
	public nodeOutput?: NodeOutput;
}
