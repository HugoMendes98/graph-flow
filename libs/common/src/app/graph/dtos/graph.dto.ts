import { GraphNodeDto } from "./node/graph-node.dto";
import { DtoProperty } from "../../../dtos/dto";
import { EntityDto } from "../../../dtos/entity";

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
