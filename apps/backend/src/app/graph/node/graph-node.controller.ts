import {
	Body,
	Controller,
	Delete,
	forwardRef,
	Get,
	Inject,
	NotFoundException,
	Param,
	Patch,
	Post,
	Query,
	UseInterceptors
} from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { GraphNodeUpdateDto } from "~/lib/common/app/graph/dtos/node";
import { GraphNodeCreateDto } from "~/lib/common/app/graph/dtos/node/graph-node.create.dto";
import { generateGraphNodesEndpoint, GraphNodeEndpoint } from "~/lib/common/app/graph/endpoints";
import { NodeDto, NodeQueryDto } from "~/lib/common/app/node/dtos";
import { NodeKindType } from "~/lib/common/app/node/dtos/kind/node-kind.type";
import { EntityId } from "~/lib/common/dtos/entity";
import { UnshiftParameters } from "~/lib/common/types";

import { UseAuth } from "../../auth/auth.guard";
import { NodeEntity } from "../../node/node.entity";
import { NodeService } from "../../node/node.service";
import { GraphEntity } from "../graph.entity";
import { ApiGraphParam, GraphInterceptedParam, GraphInterceptor } from "../graph.interceptor";

type EndpointBase = GraphNodeEndpoint<NodeEntity>;
type EndpointTransformed = {
	// Adds a Graph as a first parameter for each function
	[K in keyof EndpointBase]: UnshiftParameters<EndpointBase[K], [GraphEntity]>;
};

/**
 * {@link NodeEntity} from a {@link GraphEntity} controller
 */
@ApiTags("Graph nodes")
@Controller(generateGraphNodesEndpoint(`:${GraphInterceptor.PATH_PARAM}` as unknown as EntityId))
@UseAuth()
@UseInterceptors(GraphInterceptor)
export class GraphNodeController implements EndpointTransformed {
	/**
	 * Constructor with "dependency injection"
	 *
	 * @param service injected
	 */
	public constructor(
		@Inject(forwardRef(() => NodeService)) private readonly service: NodeService
	) {}

	@ApiGraphParam()
	@ApiOkResponse({ type: NodeDto })
	@Get()
	public findAndCount(
		@GraphInterceptedParam() graph: GraphEntity,
		@Query() { where = {}, ...params }: NodeQueryDto = {}
	) {
		return this.service.findByGraph(graph._id, where as never, params);
	}

	@ApiGraphParam()
	@ApiOkResponse({ type: NodeDto })
	@Get("/:id")
	public findById(@GraphInterceptedParam() graph: GraphEntity, @Param("id") id: number) {
		return this.validateNodeId(graph, id);
	}

	@ApiCreatedResponse({ type: NodeDto })
	@ApiGraphParam()
	@Post()
	public create(@GraphInterceptedParam() graph: GraphEntity, @Body() body: GraphNodeCreateDto) {
		return this.service.create({
			...body,
			kind: { __graph: graph._id, position: body.kind.position, type: NodeKindType.EDGE }
		});
	}

	@ApiGraphParam()
	@ApiOkResponse({ type: NodeDto })
	@Patch("/:id")
	public update(
		@GraphInterceptedParam() graph: GraphEntity,
		@Param("id") id: number,
		@Body() body: GraphNodeUpdateDto
	) {
		return this.validateNodeId(graph, id).then(({ _id, kind }) =>
			this.service.update(_id, {
				...body,
				kind: { ...kind, ...body.kind, type: NodeKindType.EDGE }
			})
		);
	}

	@ApiGraphParam()
	@ApiOkResponse({ type: NodeDto })
	@Delete("/:id")
	public delete(@GraphInterceptedParam() graph: GraphEntity, @Param("id") id: number) {
		return this.validateNodeId(graph, id).then(({ _id }) => this.service.delete(_id));
	}

	private validateNodeId(graph: GraphEntity, id: number) {
		// Determine if the graph contains the node that is being manipulated
		return this.service.findById(id).then(node => {
			const { kind } = node;
			if (kind.type !== NodeKindType.EDGE || kind.__graph !== graph._id) {
				throw new NotFoundException(`No Node{id:${id}} found in graph{id:${graph._id}}`);
			}

			return node;
		});
	}
}
