import { Collection, Entity, OneToMany } from "@mikro-orm/core";
import { GraphRelationsDto } from "~/lib/common/dtos/graph";
import { GraphNodeRelationsDto } from "~/lib/common/dtos/graph/node";

import { GraphRepository } from "./graph.repository";
import { GraphNode } from "./node/graph-node.entity";
import { EntityBase, EntityWithRelations } from "../_lib/entity";

@Entity({ customRepository: () => GraphRepository })
export class Graph extends EntityBase implements EntityWithRelations<GraphRelationsDto> {
	@OneToMany(() => GraphNode, node => node.graph, { hidden: true })
	public nodes? = new Collection<GraphNodeRelationsDto>(this);
}
