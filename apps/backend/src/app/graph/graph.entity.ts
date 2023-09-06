import { Collection, Entity, OneToMany, OneToOne } from "@mikro-orm/core";
import { GraphDto } from "~/lib/common/app/graph/dtos";
import { DtoToEntity } from "~/lib/common/dtos/entity/entity.types";

import { GraphRepository } from "./graph.repository";
import { GraphNode } from "./node/graph-node.entity";
import { EntityBase } from "../_lib/entity";
import { NodeBehaviorFunction } from "../node/behaviors/node-behavior.function";
import { Workflow } from "../workflow/workflow.entity";

@Entity({ customRepository: () => GraphRepository })
export class Graph extends EntityBase implements DtoToEntity<GraphDto> {
	// ------- Relations -------

	@OneToMany(() => GraphNode, node => node.graph, { hidden: true })
	public readonly nodes? = new Collection<GraphNode>(this);

	/**
	 * The reverse relation of a NodeBehavior.
	 * Currently only for `node-function`s
	 */
	@OneToOne(() => NodeBehaviorFunction, ({ graph }) => graph, { hidden: true, owner: false })
	public readonly nodeBehavior?: NodeBehaviorFunction | null;

	@OneToOne(() => Workflow, ({ graph }) => graph, { hidden: true, owner: false })
	public readonly workflow?: Workflow | null;
}
