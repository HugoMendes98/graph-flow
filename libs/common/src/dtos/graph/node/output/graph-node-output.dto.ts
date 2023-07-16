import { IsNumber, Min } from "class-validator";

import { DtoProperty } from "../../../_lib/dto";
import { EntityDto } from "../../../_lib/entity";

export class GraphNodeOutputDto extends EntityDto {
	/**
	 * The foreign key to the graph-node this input is linked to
	 */
	@DtoProperty()
	@IsNumber()
	@Min(0)
	public __graph_node!: number;

	/**
	 * The foreign key to the node-output this graph-output represents
	 */
	@DtoProperty()
	@IsNumber()
	@Min(0)
	public __node_output!: number;
}
