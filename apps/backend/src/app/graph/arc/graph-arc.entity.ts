import { Entity, OneToOne } from "@mikro-orm/core";
import { applyDecorators } from "@nestjs/common";
import { GraphArcDto } from "~/lib/common/app/graph/dtos/arc";
import { DtoToEntity } from "~/lib/common/dtos/entity/entity.types";

import { GraphArcRepository } from "./graph-arc.repository";
import { EntityBase } from "../../_lib/entity";
import { ManyToOneFactory, ManyToOneParams } from "../../_lib/entity/decorators";
import { NodeInput } from "../../node/input";
import { NodeOutput } from "../../node/output";

/**
 * Decorator for the "from" relation
 */
const FromProperty = ManyToOneFactory(() => NodeOutput, {
	fieldName: "__from" satisfies keyof GraphArcDto,
	// Deleting a GraphNodeOutput deletes its arcs
	onDelete: "cascade",
	onUpdateIntegrity: "cascade"
});

/**
 * Creates the decorator for the "to" relation
 *
 * @param params Relation options
 * @returns the decorator for the "to" relation
 */
function ToProperty(params: Pick<ManyToOneParams, "foreign">) {
	const { foreign } = params;

	return applyDecorators(
		OneToOne(() => NodeInput, {
			fieldName: "__to" satisfies keyof GraphArcDto,
			hidden: foreign,
			mapToPk: !foreign,
			nullable: false,
			onDelete: "cascade",
			onUpdateIntegrity: "cascade",
			owner: true,
			persist: !foreign,
			unique: true
		}) as never
	);
}

@Entity({ customRepository: () => GraphArcRepository })
export class GraphArc extends EntityBase implements DtoToEntity<GraphArcDto> {
	/** @inheritDoc */
	@FromProperty({ foreign: false })
	public readonly __from!: number;
	/** @inheritDoc */
	@ToProperty({ foreign: false })
	public readonly __to!: number;

	// ------- Relations -------

	/** @inheritDoc */
	@FromProperty({ foreign: true })
	public readonly from?: NodeOutput;
	/** @inheritDoc */
	@ToProperty({ foreign: true })
	public readonly to?: NodeInput;
}
