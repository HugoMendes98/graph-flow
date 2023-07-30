import { Entity } from "@mikro-orm/core";
import { GraphArcDto } from "~/lib/common/app/graph/dtos/arc";
import { DtoToEntity } from "~/lib/common/dtos/entity/entity.types";

import { GraphArcRepository } from "./graph-arc.repository";
import { EntityBase } from "../../_lib/entity";
import { ManyToOneFactory } from "../../_lib/entity/decorators";
import { GraphNodeInput } from "../node/input";
import { GraphNodeOutput } from "../node/output";

const FromProperty = ManyToOneFactory(() => GraphNodeOutput, {
	fieldName: "__from" satisfies keyof GraphArcDto,
	// Deleting a GraphNodeOutput deletes its arcs
	onDelete: "cascade",
	onUpdateIntegrity: "cascade"
});

const ToProperty = ManyToOneFactory(() => GraphNodeInput, {
	fieldName: "__to" satisfies keyof GraphArcDto,
	// Deleting a GraphNodeInput deletes its arcs
	onDelete: "cascade",
	onUpdateIntegrity: "cascade",
	unique: true
});

@Entity({ customRepository: () => GraphArcRepository })
export class GraphArc extends EntityBase implements DtoToEntity<GraphArcDto> {
	@FromProperty({ foreign: false })
	public readonly __from!: number;
	@ToProperty({ foreign: false })
	public readonly __to!: number;

	// ------- Relations -------

	@FromProperty({ foreign: true })
	public readonly from?: GraphNodeOutput;
	@ToProperty({ foreign: true })
	public readonly to?: GraphNodeInput;
}
