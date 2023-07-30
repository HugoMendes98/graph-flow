import { IsNumber, IsString, Min } from "class-validator";

import { DtoProperty } from "../../../../dtos/dto";
import { EntityDto } from "../../../../dtos/entity";
import { NodeDto } from "../node.dto";

export class NodeInputDto extends EntityDto {
	@DtoProperty()
	@IsNumber()
	@Min(0)
	public __node!: number;

	@DtoProperty()
	@IsString()
	public name!: string;

	// ------- Relations -------

	@DtoProperty({
		forwardRef: true,
		type: () => NodeDto
	})
	public readonly node?: NodeDto;
}
