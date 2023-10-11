import { Entity, Property, types } from "@mikro-orm/core";
import { NodeBehaviorCodeDto as DTO } from "~/lib/common/app/node/dtos/behaviors";
import { NodeBehaviorType } from "~/lib/common/app/node/dtos/behaviors/node-behavior.type";

import { NodeBehaviorBase } from "./node-behavior.base";

const type = NodeBehaviorType.CODE;

@Entity({ discriminatorValue: type })
export class NodeBehaviorCode extends NodeBehaviorBase<typeof type> implements DTO {
	@Property({ type: types.text })
	public code!: string;
}
