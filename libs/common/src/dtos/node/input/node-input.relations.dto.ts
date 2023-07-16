import { NodeInputDto } from "./node-input.dto";
import { DtoProperty } from "../../_lib/dto";
import { NodeRelationsDto } from "../node.relations.dto";

export class NodeInputRelationsDto extends NodeInputDto {
	@DtoProperty({
		forwardRef: true,
		type: () => NodeRelationsDto
	})
	public node?: NodeRelationsDto;
}
