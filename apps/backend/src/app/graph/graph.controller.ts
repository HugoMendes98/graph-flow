import { Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { ApiExcludeEndpoint, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { GraphDto, GraphQueryDto, GraphResultsDto } from "~/lib/common/dtos/graph";
import { GraphEndpoint, GRAPHS_ENDPOINT_PREFIX } from "~/lib/common/endpoints/gaph/graph.endpoint";

import { Graph } from "./graph.entity";
import { GraphService } from "./graph.service";

/**
 * The main controller for [graphs]{@link GraphDto}.
 */
@ApiTags("Graphs")
@Controller(GRAPHS_ENDPOINT_PREFIX)
export class GraphController implements GraphEndpoint<Graph> {
	public constructor(private readonly service: GraphService) {}

	@ApiOkResponse({ type: GraphResultsDto })
	@Get()
	public findAndCount(@Query() { where, ...params }: GraphQueryDto) {
		return this.service.findAndCount(where, params);
	}

	@ApiOkResponse({ type: GraphDto })
	@Get("/:id")
	public findById(@Param("id") id: number) {
		return this.service.findById(id);
	}

	// The following endpoints are hidden in the swagger documentation.
	// They are still there to return information if the request is made.

	@ApiExcludeEndpoint()
	@Post()
	private _create() {
		return this.service.create({});
	}

	@ApiExcludeEndpoint()
	@Delete("/:id")
	private _delete(@Param("id") id: number) {
		return this.service.delete(id);
	}
}