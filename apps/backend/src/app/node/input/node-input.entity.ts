import { Entity, Property } from "@mikro-orm/core";
import { DtoToEntity } from "~/lib/common/dtos/_lib/entity/entity.types";
import { NodeInputDto } from "~/lib/common/dtos/node/input";

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
	@NodeProperty({ foreign: false })
	public __node!: number;

	@Property()
	public name!: string;

	// ------- Relations -------

	@NodeProperty({ foreign: true })
	public node?: Node;
}
