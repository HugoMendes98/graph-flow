import { Entity } from "@mikro-orm/core";
import { GraphArcRelationsDto } from "~/lib/common/dtos/graph/arc";

import { GraphArcRepository } from "./graph-arc.repository";
import { EntityBase, EntityWithRelations } from "../../_lib/entity";
import { ManyToOneFactory } from "../../_lib/entity/decorators";
import { GraphNodeInput } from "../node/input";
import { GraphNodeOutput } from "../node/output";

const FromProperty = ManyToOneFactory(() => GraphNodeOutput, {
	fieldName: "__from" satisfies keyof GraphArcRelationsDto,
	onUpdateIntegrity: "cascade"
});

const ToProperty = ManyToOneFactory(() => GraphNodeInput, {
	fieldName: "__to" satisfies keyof GraphArcRelationsDto,
	onUpdateIntegrity: "cascade"
});

@Entity({ customRepository: () => GraphArcRepository })
export class GraphArc
	extends EntityBase
	implements
		EntityWithRelations<GraphArcRelationsDto, { from: GraphNodeOutput; to: GraphNodeInput }>
{
	@FromProperty({ foreign: false })
	public readonly __from!: number;
	@FromProperty({ foreign: true })
	public readonly from?: GraphNodeOutput;

	@ToProperty({ foreign: false })
	public readonly __to!: number;
	@ToProperty({ foreign: true })
	public readonly to?: GraphNodeInput;
}
