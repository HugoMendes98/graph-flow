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
import { ApiCreatedResponse, ApiExcludeEndpoint, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import {
	GraphArcCreateDto,
	GraphArcDto,
	GraphArcQueryDto,
	GraphArcResultsDto
} from "~/lib/common/app/graph/dtos/arc";
import { generateGraphArcsEndpoint, GraphArcEndpoint } from "~/lib/common/app/graph/endpoints";
import { EntityId } from "~/lib/common/dtos/entity";
import { UnshiftParameters } from "~/lib/common/types";

import { GraphArc } from "./graph-arc.entity";
import { GraphArcService } from "./graph-arc.service";
import { UseAuth } from "../../auth/auth.guard";
import { Graph } from "../graph.entity";
import { ApiGraphParam, GraphInterceptedParam, GraphInterceptor } from "../graph.interceptor";

type EndpointBase = GraphArcEndpoint<GraphArc>;
type EndpointTransformed = {
	// Adds a Graph as a first parameter for each function
	[K in keyof EndpointBase]: UnshiftParameters<EndpointBase[K], [Graph]>;
};

@ApiTags("Graph arcs")
@Controller(generateGraphArcsEndpoint(`:${GraphInterceptor.PATH_PARAM}` as unknown as EntityId))
@UseAuth()
@UseInterceptors(GraphInterceptor)
export class GraphArcController implements EndpointTransformed {
	public constructor(private readonly service: GraphArcService) {}

	@ApiGraphParam()
	@ApiOkResponse({ type: GraphArcResultsDto })
	@Get()
	public findAndCount(
		@GraphInterceptedParam() graph: Graph,
		@Query() { where = {}, ...params }: GraphArcQueryDto = {}
	) {
		return this.service.findAndCount(
			{
				$and: [
					{
						from: { graphNode: { __graph: graph._id } },
						to: { graphNode: { __graph: graph._id } }
					},
					where
				]
			},
			params
		);
	}

	@ApiGraphParam()
	@ApiOkResponse({ type: GraphArcDto })
	@Get("/:id")
	public findById(@GraphInterceptedParam() graph: Graph, @Param("id") id: number) {
		return this.validateArcId(graph, id);
	}

	@ApiCreatedResponse({ type: GraphArcDto })
	@ApiGraphParam()
	@Post()
	public create(@GraphInterceptedParam() _graph: Graph, @Body() body: GraphArcCreateDto) {
		// TODO: verify graph
		return this.service.create(body);
	}

	@ApiExcludeEndpoint()
	@Patch("/:id")
	public update(@GraphInterceptedParam() _: Graph, @Param("id") id: number) {
		return this.service.update(id, {});
	}

	@ApiGraphParam()
	@ApiOkResponse({ type: GraphArcDto })
	@Delete("/:id")
	public delete(@GraphInterceptedParam() graph: Graph, @Param("id") id: number) {
		return this.validateArcId(graph, id).then(({ _id }) => this.service.delete(_id));
	}

	/**
	 * Determines if the graph contains the arc that is being manipulated
	 *
	 * @param graph the graph on which the arc should be present
	 * @param id of the arc
	 * @returns the found arc
	 */
	private validateArcId(graph: Graph, id: number): Promise<GraphArc> {
		return this.service
			.findById(id, { populate: { from: { graphNode: true }, to: { graphNode: true } } })
			.then(arc => {
				const [fromGraph, toGraph] = [arc.from.graphNode.__graph, arc.to.graphNode.__graph];

				if (graph._id !== fromGraph || fromGraph !== toGraph) {
					throw new NotFoundException(
						`No GraphArc{id:${id}} found in graph{id:${graph._id}}`
					);
				}

				return arc;
			});
	}
}
