import { Entity, EntityRepositoryType, Property } from "@mikro-orm/core";
import { NodeInputDto, NodeInputRelationsDto } from "~/lib/common/dtos/node/input";

import { NodeInputRepository } from "./node-input.repository";
import { EntityBase, EntityWithRelations } from "../../_lib/entity";
import { ManyToOneFactory } from "../../_lib/entity/decorators";
import { Node } from "../node.entity";

const NodeProperty = ManyToOneFactory(() => Node, {
	fieldName: "__node" satisfies keyof NodeInputDto,
	onUpdateIntegrity: "cascade"
});

@Entity({ customRepository: () => NodeInputRepository })
export class NodeInput
	extends EntityBase
	implements EntityWithRelations<NodeInputRelationsDto, { node: Node }>
{
	// With this, we can reuse the repository from an entity already loaded
	public readonly [EntityRepositoryType]?: NodeInputRepository;

	@NodeProperty({ foreign: false })
	public __node!: number;

	@NodeProperty({ foreign: true })
	public node?: Node;

	@Property()
	public name!: string;
}
