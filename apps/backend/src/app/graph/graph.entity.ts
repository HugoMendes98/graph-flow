import { Collection, Entity, OneToMany } from "@mikro-orm/core";
import { DtoToEntity } from "~/lib/common/dtos/_lib/entity/entity.types";
import { GraphDto } from "~/lib/common/dtos/graph";

import { GraphRepository } from "./graph.repository";
import { GraphNode } from "./node/graph-node.entity";
import { EntityBase } from "../_lib/entity";

@Entity({ customRepository: () => GraphRepository })
export class Graph extends EntityBase implements DtoToEntity<GraphDto> {
	// ------- Relations -------

	@OneToMany(() => GraphNode, node => node.graph, { hidden: true })
	public readonly nodes? = new Collection<GraphNode>(this);
}
