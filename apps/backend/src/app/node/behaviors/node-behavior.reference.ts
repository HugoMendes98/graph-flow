import { Entity } from "@mikro-orm/core";
import { NodeDto } from "~/lib/common/app/node/dtos";
import { NodeBehaviorReferenceDto as DTO } from "~/lib/common/app/node/dtos/behaviors";
import { NodeBehaviorType } from "~/lib/common/app/node/dtos/behaviors/node-behavior.type";
import { EntityId } from "~/lib/common/dtos/entity";

import { NodeBehaviorBase } from "./node-behavior.base";
import { ManyToOneFactory } from "../../_lib/entity/decorators";
import { NodeEntity } from "../node.entity";

const type = NodeBehaviorType.REFERENCE;

const NodeProperty = ManyToOneFactory(() => NodeEntity, {
	fieldName: "__node" satisfies keyof DTO,
	onUpdateIntegrity: "cascade"
});

@Entity({ discriminatorValue: type })
export class NodeBehaviorReference extends NodeBehaviorBase<typeof type> implements DTO {
	/** @inheritDoc */
	@NodeProperty({ foreign: false })
	public readonly __node!: EntityId;

	/** @inheritDoc */
	@NodeProperty({ foreign: true })
	public readonly node?: NodeDto; // FIXME
}
