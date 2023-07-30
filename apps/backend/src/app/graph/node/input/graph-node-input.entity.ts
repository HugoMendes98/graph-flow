import { Entity, OneToOne } from "@mikro-orm/core";
import { GraphNodeInputDto } from "~/lib/common/app/graph/dtos/node/input";
import { DtoToEntity } from "~/lib/common/dtos/entity/entity.types";

import { GraphNodeInputRepository } from "./graph-node-input.repository";
import { EntityBase } from "../../../_lib/entity";
import { ManyToOneFactory } from "../../../_lib/entity/decorators";
import { NodeInput } from "../../../node/input";
import { GraphArc } from "../../arc/graph-arc.entity";
import { GraphNode } from "../graph-node.entity";

const GraphNodeProperty = ManyToOneFactory(() => GraphNode, {
	fieldName: "__graph_node" satisfies keyof GraphNodeInputDto,
	// Deleting a GraphNode deletes its inputs
	onDelete: "cascade",
	onUpdateIntegrity: "cascade"
});

const NodeInputProperty = ManyToOneFactory(() => NodeInput, {
	fieldName: "__node_input" satisfies keyof GraphNodeInputDto,
	onUpdateIntegrity: "cascade"
});

@Entity({ customRepository: () => GraphNodeInputRepository })
export class GraphNodeInput extends EntityBase implements DtoToEntity<GraphNodeInputDto> {
	@GraphNodeProperty({ foreign: false })
	public __graph_node!: number;
	@NodeInputProperty({ foreign: false })
	public __node_input!: number;

	// ------- Relations -------
	@OneToOne(() => GraphArc, ({ to }) => to, { hidden: true, owner: false })
	public readonly graphArc?: GraphArc;

	@GraphNodeProperty({ foreign: true })
	public readonly graphNode?: GraphNode;
	@NodeInputProperty({ foreign: true })
	public readonly nodeInput?: NodeInput;
}
