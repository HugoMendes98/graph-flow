import { GraphNodeDto } from "./node/graph-node.dto";
import { DtoProperty } from "../_lib/dto";
import { EntityDto } from "../_lib/entity";

export class GraphDto extends EntityDto {
	// Probably just empty
	// TODO: viewport ?

	// ------- Relations -------

	@DtoProperty({
		array: true,
		forwardRef: true,
		type: () => GraphNodeDto
	})
	public readonly nodes?: GraphNodeDto[];
}
