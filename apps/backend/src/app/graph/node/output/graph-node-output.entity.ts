import { Entity } from "@mikro-orm/core";
import { DtoToEntity } from "~/lib/common/dtos/_lib/entity/entity.types";
import { GraphNodeOutputDto } from "~/lib/common/dtos/graph/node/output";

import { GraphNodeOutputRepository } from "./graph-node-output.repository";
import { EntityBase } from "../../../_lib/entity";
import { ManyToOneFactory } from "../../../_lib/entity/decorators";
import { NodeOutput } from "../../../node/output";
import { GraphNode } from "../graph-node.entity";

const GraphNodeProperty = ManyToOneFactory(() => GraphNode, {
	fieldName: "__graph_node" satisfies keyof GraphNodeOutputDto,
	onUpdateIntegrity: "cascade"
});

const NodeOutputProperty = ManyToOneFactory(() => NodeOutput, {
	fieldName: "__node_output" satisfies keyof GraphNodeOutputDto,
	onUpdateIntegrity: "cascade"
});

@Entity({ customRepository: () => GraphNodeOutputRepository })
export class GraphNodeOutput extends EntityBase implements DtoToEntity<GraphNodeOutputDto> {
	@GraphNodeProperty({ foreign: false })
	public __graph_node!: number;
	@NodeOutputProperty({ foreign: false })
	public __node_output!: number;

	// ------- Relations -------

	@GraphNodeProperty({ foreign: true })
	public readonly graphNode?: GraphNode;
	@NodeOutputProperty({ foreign: true })
	public readonly nodeOutput?: NodeOutput;
}
