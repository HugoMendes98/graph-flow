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
import { generateGraphNodesEndpoint, GraphNodeEndpoint } from "~/lib/common/app/graph/endpoints";
import { NodeCreateDto, NodeDto, NodeQueryDto, NodeUpdateDto } from "~/lib/common/app/node/dtos";
import { NodeKindEdgeDto, NodeKindType } from "~/lib/common/app/node/dtos/kind";
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
		return this.service.findAndCount(
			{ $and: [{ kind: { __graph: graph._id, type: NodeKindType.EDGE } }, where] },
			params
		);
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
	public create(@GraphInterceptedParam() graph: GraphEntity, @Body() body: NodeCreateDto) {
		return this.service.create({
			...body,
			kind: { ...(body.kind as NodeKindEdgeDto), __graph: graph._id, type: NodeKindType.EDGE }
		});
	}

	@ApiGraphParam()
	@ApiOkResponse({ type: NodeDto })
	@Patch("/:id")
	public update(
		@GraphInterceptedParam() graph: GraphEntity,
		@Param("id") id: number,
		@Body() body: NodeUpdateDto
	) {
		return this.validateNodeId(graph, id).then(({ _id }) => this.service.update(_id, body));
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
