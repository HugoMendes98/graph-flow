import { IsNumber, IsString, Min } from "class-validator";

import { DtoProperty } from "../../../../dtos/dto";
import { EntityDto } from "../../../../dtos/entity";
import { NodeDto } from "../node.dto";

export class NodeInputDto extends EntityDto {
	/**
	 * Foreign key to the node it is connected
	 */
	@DtoProperty()
	@IsNumber()
	@Min(0)
	public __node!: number;

	/**
	 * Name of this input
	 */
	@DtoProperty()
	@IsString()
	public name!: string;

	// ------- Relations -------

	/**
	 * Foreign data of the {@link NodeDto} it is connected
	 */
	@DtoProperty({
		forwardRef: true,
		type: () => NodeDto
	})
	public readonly node?: NodeDto;
}
