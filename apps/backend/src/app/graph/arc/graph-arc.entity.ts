import { Entity, OneToOne } from "@mikro-orm/core";
import { applyDecorators } from "@nestjs/common";
import { GraphArcDto } from "~/lib/common/app/graph/dtos/arc";
import { DtoToEntity } from "~/lib/common/dtos/entity/entity.types";

import { GraphArcRepository } from "./graph-arc.repository";
import { EntityBase } from "../../_lib/entity";
import { ManyToOneFactory, ManyToOneParams } from "../../_lib/entity/decorators";
import { GraphNodeInput } from "../node/input";
import { GraphNodeOutput } from "../node/output";

const FromProperty = ManyToOneFactory(() => GraphNodeOutput, {
	fieldName: "__from" satisfies keyof GraphArcDto,
	// Deleting a GraphNodeOutput deletes its arcs
	onDelete: "cascade",
	onUpdateIntegrity: "cascade"
});

const ToProperty = ({ foreign }: Pick<ManyToOneParams, "foreign">) =>
	applyDecorators(
		OneToOne(() => GraphNodeInput, {
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

@Entity({ customRepository: () => GraphArcRepository })
export class GraphArc extends EntityBase implements DtoToEntity<GraphArcDto> {
	/**
	 * @inheritDoc
	 */
	@FromProperty({ foreign: false })
	public readonly __from!: number;
	/**
	 * @inheritDoc
	 */
	@ToProperty({ foreign: false })
	public readonly __to!: number;

	// ------- Relations -------

	@FromProperty({ foreign: true })
	public readonly from?: GraphNodeOutput;
	@ToProperty({ foreign: true })
	public readonly to?: GraphNodeInput;
}
