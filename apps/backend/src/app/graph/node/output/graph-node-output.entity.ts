import { Entity } from "@mikro-orm/core";
import { GraphNodeOutputDto } from "~/lib/common/app/graph/dtos/node/output";
import { DtoToEntity } from "~/lib/common/dtos/entity/entity.types";

import { GraphNodeOutputRepository } from "./graph-node-output.repository";
import { EntityBase } from "../../../_lib/entity";
import { ManyToOneFactory } from "../../../_lib/entity/decorators";
import { NodeOutput } from "../../../node/output";
import { GraphNode } from "../graph-node.entity";

const GraphNodeProperty = ManyToOneFactory(() => GraphNode, {
	fieldName: "__graph_node" satisfies keyof GraphNodeOutputDto,
	// Deleting a GraphNode deletes its outputs
	onDelete: "cascade",
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
