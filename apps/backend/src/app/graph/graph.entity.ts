import { Collection, Entity, OneToMany } from "@mikro-orm/core";
import { GraphRelationsDto } from "~/app/common/dtos/graph";
import { GraphNodeRelationsDto } from "~/app/common/dtos/graph/node";

import { GraphNode } from "./graph-node/graph-node.entity";
import { GraphRepository } from "./graph.repository";
import { EntityBase, EntityWithRelations } from "../_lib/entity";

@Entity({ customRepository: () => GraphRepository })
export class Graph extends EntityBase implements EntityWithRelations<GraphRelationsDto> {
	@OneToMany(() => GraphNode, node => node.graph, { hidden: true })
	public nodes? = new Collection<GraphNodeRelationsDto>(this);
}
