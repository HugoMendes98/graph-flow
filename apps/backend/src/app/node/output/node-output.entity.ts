import { Entity, Enum, LoadStrategy, ManyToOne, Property } from "@mikro-orm/core";
import { NodeOutputDto } from "~/lib/common/app/node/dtos/output";
import { NodeIoType } from "~/lib/common/app/node/io";
import { EntityId } from "~/lib/common/dtos/entity";
import { DtoToEntity } from "~/lib/common/dtos/entity/entity.types";

import { NodeOutputRepository } from "./node-output.repository";
import { EntityBase } from "../../_lib/entity";
import { ManyToOneFactory } from "../../_lib/entity/decorators";
import { Node } from "../node.entity";

const NodeProperty = ManyToOneFactory(() => Node, {
	fieldName: "__node" satisfies keyof NodeOutputDto,
	onDelete: "cascade",
	onUpdateIntegrity: "cascade",
	strategy: LoadStrategy.JOINED
});

@Entity({ customRepository: () => NodeOutputRepository })
export class NodeOutput extends EntityBase implements DtoToEntity<NodeOutputDto> {
	/**
	 * @inheritDoc
	 */
	@NodeProperty({ foreign: false })
	public __node!: number;

	/**
	 * @inheritDoc
	 */
	@ManyToOne(() => NodeOutput, { mapToPk: true, nullable: true, type: () => Number })
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
	public readonly node?: Node;
}
