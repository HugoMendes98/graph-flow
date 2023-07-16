import { IsNumber, IsString, Min } from "class-validator";

import { DtoProperty } from "../../_lib/dto";
import { EntityDto } from "../../_lib/entity";

export class NodeInputDto extends EntityDto {
	@DtoProperty()
	@IsNumber()
	@Min(0)
	public __node!: number;

	@DtoProperty()
	@IsString()
	public name!: string;
}
