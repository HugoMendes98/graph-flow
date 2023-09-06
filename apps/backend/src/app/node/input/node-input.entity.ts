import { Entity, Property } from "@mikro-orm/core";
import { NodeInputDto } from "~/lib/common/app/node/dtos/input";
import { DtoToEntity } from "~/lib/common/dtos/entity/entity.types";

import { NodeInputRepository } from "./node-input.repository";
import { EntityBase } from "../../_lib/entity";
import { ManyToOneFactory } from "../../_lib/entity/decorators";
import { Node } from "../node.entity";

const NodeProperty = ManyToOneFactory(() => Node, {
	fieldName: "__node" satisfies keyof NodeInputDto,
	onDelete: "cascade",
	onUpdateIntegrity: "cascade"
});

@Entity({ customRepository: () => NodeInputRepository })
export class NodeInput extends EntityBase implements DtoToEntity<NodeInputDto> {
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

	// ------- Relations -------

	@NodeProperty({ foreign: true })
	public node?: Node;
}
