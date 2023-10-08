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
import { NodeKindType } from "~/lib/common/app/node/dtos/kind/node-kind.type";
import { EntityId } from "~/lib/common/dtos/entity";
import { UnshiftParameters } from "~/lib/common/types";

import { GraphArcEntity } from "./graph-arc.entity";
import { GraphArcService } from "./graph-arc.service";
import { UseAuth } from "../../auth/auth.guard";
import { GraphEntity } from "../graph.entity";
import { ApiGraphParam, GraphInterceptedParam, GraphInterceptor } from "../graph.interceptor";

/** @internal */
type EndpointBase = GraphArcEndpoint<GraphArcEntity>;
/** @internal */
type EndpointTransformed = {
	// Adds a Graph as a first parameter for each function
	[K in keyof EndpointBase]: UnshiftParameters<EndpointBase[K], [GraphEntity]>;
};

/**
 * {@link GraphArc} main controller
 */
@ApiTags("Graph arcs")
@Controller(generateGraphArcsEndpoint(`:${GraphInterceptor.PATH_PARAM}` as unknown as EntityId))
@UseAuth()
@UseInterceptors(GraphInterceptor)
export class GraphArcController implements EndpointTransformed {
	/**
	 * Constructor with "dependency injection"
	 *
	 * @param service injected
	 */
	public constructor(private readonly service: GraphArcService) {}

	@ApiGraphParam()
	@ApiOkResponse({ type: GraphArcResultsDto })
	@Get()
	public findAndCount(
		@GraphInterceptedParam() graph: GraphEntity,
		@Query() { where = {}, ...params }: GraphArcQueryDto = {}
	) {
		return this.service.findByGraph(graph._id, where, params);
	}

	@ApiGraphParam()
	@ApiOkResponse({ type: GraphArcDto })
	@Get("/:id")
	public findById(@GraphInterceptedParam() graph: GraphEntity, @Param("id") id: number) {
		return this.validateArcId(graph, id);
	}

	@ApiCreatedResponse({ type: GraphArcDto })
	@ApiGraphParam()
	@Post()
	public create(@GraphInterceptedParam() _graph: GraphEntity, @Body() body: GraphArcCreateDto) {
		// TODO: verify graph
		return this.service.create(body);
	}

	@ApiExcludeEndpoint()
	@Patch("/:id")
	public update(@GraphInterceptedParam() _: GraphEntity, @Param("id") id: number) {
		return this.service.update(id, {});
	}

	@ApiGraphParam()
	@ApiOkResponse({ type: GraphArcDto })
	@Delete("/:id")
	public delete(@GraphInterceptedParam() graph: GraphEntity, @Param("id") id: number) {
		return this.validateArcId(graph, id).then(({ _id }) => this.service.delete(_id));
	}

	/**
	 * Determines if the graph contains the arc that is being manipulated
	 *
	 * @param graph the graph on which the arc should be present
	 * @param id of the arc
	 * @returns the found arc
	 */
	private validateArcId(graph: GraphEntity, id: number): Promise<GraphArcEntity> {
		return this.service
			.findById(id, { populate: { from: { node: true }, to: { node: true } } })
			.then(arc => {
				for (const kind of [arc.from.node.kind, arc.to.node.kind]) {
					if (kind.type !== NodeKindType.VERTEX || kind.__graph !== graph._id) {
						throw new NotFoundException(
							`No GraphArc{id:${id}} found in Graph{id:${graph._id}}`
						);
					}
				}

				return arc;
			});
	}
}
