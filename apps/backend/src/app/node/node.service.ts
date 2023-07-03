import { Injectable } from "@nestjs/common";
import { NodeCreateDto, NodeUpdateDto } from "~/app/common/dtos/node";

import { Node } from "./node.entity";
import { NodeRepository } from "./node.repository";
import { EntityService } from "../_lib/entity";

/**
 * Service to manages [nodes]{@link Node}.
 */
@Injectable()
export class NodeService extends EntityService<Node, NodeCreateDto, NodeUpdateDto> {
	public constructor(repository: NodeRepository) {
		super(repository);
	}
}
