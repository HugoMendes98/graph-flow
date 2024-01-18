import { Entity, Enum, ManyToOne, Property } from "@mikro-orm/core";
import { NodeInputDto } from "~/lib/common/app/node/dtos/input";
import { NodeIoType } from "~/lib/common/app/node/io";
import { EntityId } from "~/lib/common/dtos/entity";
import { DtoToEntity } from "~/lib/common/dtos/entity/entity.types";

import { NodeInputRepository } from "./node-input.repository";
import { EntityBase } from "../../_lib/entity";
import { ManyToOneFactory } from "../../_lib/entity/decorators";
import { NodeEntity } from "../node.entity";

/** @internal */
const NodeProperty = ManyToOneFactory(() => NodeEntity, {
	fieldName: "__node" satisfies keyof NodeInputDto,
	onDelete: "cascade",
	onUpdateIntegrity: "cascade"
});

/**
 * The entity for a `node-input`
 */
@Entity({ customRepository: () => NodeInputRepository })
export class NodeInputEntity
	extends EntityBase
	implements DtoToEntity<NodeInputDto>
{
	/** @inheritDoc */
	@NodeProperty({ foreign: false })
	public __node!: number;

	@ManyToOne(() => NodeInputEntity, {
		fieldName: "__ref" satisfies keyof NodeInputDto,
		mapToPk: true,
		nullable: true,
		type: () => Number
	})
	public __ref!: EntityId | null;

	/** @inheritDoc */
	@Property()
	public name!: string;

	/** @inheritDoc */
	@Enum({ items: () => NodeIoType, type: () => NodeIoType })
	public type!: NodeIoType;

	// ------- Relations -------

	@NodeProperty({ foreign: true })
	public node?: NodeEntity;
}
