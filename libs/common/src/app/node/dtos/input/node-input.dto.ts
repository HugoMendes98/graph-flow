import { IsEnum, IsNumber, IsOptional, IsString, Min } from "class-validator";

import { DtoProperty } from "../../../../dtos/dto";
import { EntityDto, EntityId } from "../../../../dtos/entity";
import { NodeIoType } from "../../io";
import { NodeDto } from "../node.dto";

/**
 * Represents an input for a [Node]{@link NodeDto}
 */
export class NodeInputDto extends EntityDto {
	/**
	 * Foreign key to the node it is connected
	 */
	@DtoProperty()
	@IsNumber()
	@Min(0)
	public readonly __node!: EntityId;

	/**
	 * When the node is a reference, the input is linked to an ref input
	 */
	@DtoProperty({ nullable: true, type: () => Number })
	public readonly __ref!: EntityId | null;

	/**
	 * Name of this input
	 */
	@DtoProperty()
	@IsString()
	public name!: string;

	/**
	 * Type of the input
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
	@DtoProperty({ type: () => NodeDto })
	public readonly node?: NodeDto;
}
