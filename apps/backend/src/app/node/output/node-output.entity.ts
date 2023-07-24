import { Entity, LoadStrategy, Property } from "@mikro-orm/core";
import { DtoToEntity } from "~/lib/common/dtos/_lib/entity/entity.types";
import { NodeOutputDto } from "~/lib/common/dtos/node/output";

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
	@NodeProperty({ foreign: false })
	public __node!: number;

	@Property()
	public name!: string;

	// ------- Relations -------

	@NodeProperty({ foreign: true })
	public readonly node?: Node;
}
