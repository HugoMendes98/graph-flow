import { Entity, Enum, LoadStrategy, ManyToOne, Property } from "@mikro-orm/core";
import { NodeOutputDto } from "~/lib/common/app/node/dtos/output";
import { NodeIoType } from "~/lib/common/app/node/io";
import { EntityId } from "~/lib/common/dtos/entity";
import { DtoToEntity } from "~/lib/common/dtos/entity/entity.types";

import { NodeOutputRepository } from "./node-output.repository";
import { EntityBase } from "../../_lib/entity";
import { ManyToOneFactory } from "../../_lib/entity/decorators";
import { NodeEntity } from "../node.entity";

const NodeProperty = ManyToOneFactory(() => NodeEntity, {
	fieldName: "__node" satisfies keyof NodeOutputDto,
	onDelete: "cascade",
	onUpdateIntegrity: "cascade",
	strategy: LoadStrategy.JOINED
});

@Entity({ customRepository: () => NodeOutputRepository })
export class NodeOutputEntity extends EntityBase implements DtoToEntity<NodeOutputDto> {
	/**
	 * @inheritDoc
	 */
	@NodeProperty({ foreign: false })
	public __node!: number;

	/**
	 * @inheritDoc
	 */
	@ManyToOne(() => NodeOutputEntity, { mapToPk: true, nullable: true, type: () => Number })
	public __ref!: EntityId | null;

	/**
	 * @inheritDoc
	 */
	@Property()
	public name!: string;

	/**
	 * @inheritDoc
	 */
	@Enum({ items: () => NodeIoType, type: () => NodeIoType })
	public type!: NodeIoType;

	// ------- Relations -------

	/**
	 * @inheritDoc
	 */
	@NodeProperty({ foreign: true })
	public readonly node?: NodeEntity;
}
