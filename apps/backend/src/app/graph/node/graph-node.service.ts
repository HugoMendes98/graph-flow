import { Injectable } from "@nestjs/common";
import { GraphNodeCreateDto, GraphNodeUpdateDto } from "~/lib/common/app/graph/dtos/node";
import { GraphNodeInputCreateDto } from "~/lib/common/app/graph/dtos/node/input";
import { GraphNodeOutputCreateDto } from "~/lib/common/app/graph/dtos/node/output";

import { GraphNode } from "./graph-node.entity";
import { GraphNodeRepository } from "./graph-node.repository";
import { GraphNodeInput } from "./input";
import { GraphNodeOutput } from "./output";
import { EntityRelationKeys, EntityService, EntityServiceCreateOptions } from "../../_lib/entity";
import { NodeService } from "../../node/node.service";

export type GraphNodeCreate = GraphNodeCreateDto & Pick<GraphNode, "__graph">;

/**
 * Service to manages [graph-nodes]{@link GraphNode}.
 */
@Injectable()
export class GraphNodeService extends EntityService<
	GraphNode,
	GraphNodeCreate,
	GraphNodeUpdateDto
> {
	public constructor(repository: GraphNodeRepository, private readonly nodeService: NodeService) {
		super(repository);
	}

	/**
	 * @inheritDoc
	 */
	public override async create<P extends EntityRelationKeys<GraphNode>>(
		toCreate: GraphNodeCreate,
		options?: EntityServiceCreateOptions<GraphNode, P>
	): Promise<GraphNode & Required<Pick<GraphNode, P | "toJSON">>> {
		const { inputs, name, outputs } = await this.nodeService.findById(toCreate.__node, {
			populate: ["inputs", "outputs"]
		});

		const { _id } = await this.repository.getEntityManager().transactional(async em => {
			// First create the graph-node to get its inserted id
			const toInsert: GraphNodeCreate = { name, ...toCreate };
			const graphNode = em.getRepository(GraphNode).create(toInsert as never);
			await em.flush();

			// Create the inputs and outputs with the created graph-node
			const inputRepository = em.getRepository(GraphNodeInput);
			const outputRepository = em.getRepository(GraphNodeOutput);

			for (const { _id } of inputs) {
				const toCreate: GraphNodeInputCreateDto = {
					__graph_node: graphNode._id,
					__node_input: _id
				};
				inputRepository.create(toCreate as never);
			}
			for (const { _id } of outputs) {
				const toCreate: GraphNodeOutputCreateDto = {
					__graph_node: graphNode._id,
					__node_output: _id
				};
				outputRepository.create(toCreate as never);
			}

			return graphNode;
		});

		this.clearEM();
		return this.findById<P>(_id, options?.findOptions);
	}
}
