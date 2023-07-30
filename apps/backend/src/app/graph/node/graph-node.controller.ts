import {
	Body,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Patch,
	Post,
	Query,
	UseInterceptors
} from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import {
	GraphNodeCreateDto,
	GraphNodeDto,
	GraphNodeQueryDto,
	GraphNodeResultsDto,
	GraphNodeUpdateDto
} from "~/lib/common/app/graph/dtos/node";
import { generateGraphNodesEndpoint, GraphNodeEndpoint } from "~/lib/common/app/graph/endpoints";
import { EntityId } from "~/lib/common/dtos/entity";
import { UnshiftParameters } from "~/lib/common/types";

import { GraphNode } from "./graph-node.entity";
import { GraphNodeService } from "./graph-node.service";
import { Graph } from "../graph.entity";
import { ApiGraphParam, GraphInterceptedParam, GraphInterceptor } from "../graph.interceptor";

type EndpointBase = GraphNodeEndpoint<GraphNode>;
type EndpointTransformed = {
	// Adds a Graph as a first parameter for each function
	[K in keyof EndpointBase]: UnshiftParameters<EndpointBase[K], [Graph]>;
};

@ApiTags("Graph nodes")
@Controller(generateGraphNodesEndpoint(`:${GraphInterceptor.PATH_PARAM}` as unknown as EntityId))
@UseInterceptors(GraphInterceptor)
export class GraphNodeController implements EndpointTransformed {
	public constructor(private readonly service: GraphNodeService) {}

	@ApiGraphParam()
	@ApiOkResponse({ type: GraphNodeResultsDto })
	@Get()
	public findAndCount(
		@GraphInterceptedParam() graph: Graph,
		@Query() { where = {}, ...params }: GraphNodeQueryDto = {}
	) {
		return this.service.findAndCount({ $and: [{ __graph: graph._id }, where] }, params);
	}

	@ApiGraphParam()
	@ApiOkResponse({ type: GraphNodeDto })
	@Get("/:id")
	public findById(@GraphInterceptedParam() graph: Graph, @Param("id") id: number) {
		return this.validateNodeId(graph, id);
	}

	@ApiCreatedResponse({ type: GraphNodeDto })
	@ApiGraphParam()
	@Post()
	public create(@GraphInterceptedParam() graph: Graph, @Body() body: GraphNodeCreateDto) {
		return this.service.create({ ...body, __graph: graph._id });
	}

	@ApiGraphParam()
	@ApiOkResponse({ type: GraphNodeDto })
	@Patch()
	public update(
		@GraphInterceptedParam() graph: Graph,
		@Param("id") id: number,
		@Body() body: GraphNodeUpdateDto
	) {
		return this.validateNodeId(graph, id).then(({ _id }) => this.service.update(_id, body));
	}

	@ApiGraphParam()
	@ApiOkResponse({ type: GraphNodeDto })
	@Delete()
	public delete(@GraphInterceptedParam() graph: Graph, @Param("id") id: number) {
		return this.validateNodeId(graph, id).then(({ _id }) => this.service.delete(_id));
	}

	private validateNodeId(graph: Graph, id: number) {
		// Determine if the graph contains the node that is being manipulated
		return this.service.findById(id).then(node => {
			if (graph._id !== node.__graph) {
				throw new NotFoundException(
					`No GraphNode{id:${id}} found in graph{id:${graph._id}}`
				);
			}

			return node;
		});
	}
}
