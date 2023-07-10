import { Embeddable, Enum } from "@mikro-orm/core";
import {
	NodeBehaviorBase as NodeBehaviorBaseDto,
	NodeBehaviorDiscriminatorKey,
	NodeBehaviorType
} from "~/app/common/dtos/node/node-behaviors";

@Embeddable({
	abstract: true,
	discriminatorColumn: "type" satisfies NodeBehaviorDiscriminatorKey
})
export abstract class NodeBehaviorBase implements NodeBehaviorBaseDto {
	@Enum({ items: () => NodeBehaviorType })
	public readonly type!: NodeBehaviorType;
}
