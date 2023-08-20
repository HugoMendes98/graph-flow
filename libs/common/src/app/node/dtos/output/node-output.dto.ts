import { IsEnum, IsNumber, IsOptional, IsString, Min } from "class-validator";

import { DtoProperty } from "../../../../dtos/dto";
import { EntityDto } from "../../../../dtos/entity";
import { NodeIoType } from "../io";
import { NodeDto } from "../node.dto";

export class NodeOutputDto extends EntityDto {
	/**
	 * Foreign key to the {@link NodeDto} it is connected
	 */
	@DtoProperty()
	@IsNumber()
	@Min(0)
	public __node!: number;

	/**
	 * Name of this output
	 */
	@DtoProperty()
	@IsString()
	public name!: string;

	/**
	 * Type of the output
	 *
	 * @default NodeIoType.ANY
	 */
	@DtoProperty()
	@IsEnum(NodeIoType)
	@IsOptional()
	public type!: NodeIoType;

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
