import { NodeOutputDto } from "./node-output.dto";
import { DtoProperty } from "../../_lib/dto";
import { NodeRelationsDto } from "../node.relations.dto";

export class NodeOutputRelationsDto extends NodeOutputDto {
	@DtoProperty({
		forwardRef: true,
		type: () => NodeRelationsDto
	})
	public node?: NodeRelationsDto;
}
