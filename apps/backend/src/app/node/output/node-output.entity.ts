import { Entity, Enum, LoadStrategy, Property } from "@mikro-orm/core";
import { NodeIoType } from "~/lib/common/app/node/dtos/io";
import { NodeOutputDto } from "~/lib/common/app/node/dtos/output";
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
	@Property()
	public name!: string;

	/**
	 * @inheritDoc
	 */
	@Enum({ items: () => NodeIoType, type: () => NodeIoType })
	public type!: NodeIoType;

	// ------- Relations -------

	@NodeProperty({ foreign: true })
	public readonly node?: Node;
}
