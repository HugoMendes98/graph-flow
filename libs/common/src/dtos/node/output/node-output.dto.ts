import { IsNumber, IsString, Min } from "class-validator";

import { DtoProperty } from "../../_lib/dto";
import { EntityDto } from "../../_lib/entity";
import { NodeDto } from "../node.dto";

export class NodeOutputDto extends EntityDto {
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
