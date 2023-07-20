import { Entity, EntityRepositoryType, Property } from "@mikro-orm/core";
import { NodeRelationsDto } from "~/lib/common/dtos/node";
import { NodeOutputRelationsDto } from "~/lib/common/dtos/node/output";

import { NodeOutputRepository } from "./node-output.repository";
import { EntityBase, EntityWithRelations } from "../../_lib/entity";
import { ManyToOneFactory } from "../../_lib/entity/decorators";
import { Node } from "../node.entity";

const NodeProperty = ManyToOneFactory(() => Node, {
	fieldName: "__node" satisfies keyof NodeOutputRelationsDto,
	onUpdateIntegrity: "cascade"
});

@Entity({ customRepository: () => NodeOutputRepository })
export class NodeOutput extends EntityBase implements EntityWithRelations<NodeOutputRelationsDto> {
	// With this, we can reuse the repository from an entity already loaded
	public readonly [EntityRepositoryType]?: NodeOutputRepository;

	@NodeProperty({ foreign: false })
	public __node!: number;

	@NodeProperty({ foreign: true })
	public node?: NodeRelationsDto;

	@Property()
	public name!: string;
}
