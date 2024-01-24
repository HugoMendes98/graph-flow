import { Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { ApiExcludeEndpoint, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import {
	GraphDto,
	GraphQueryDto,
	GraphResultsDto
} from "~/lib/common/app/graph/dtos";
import {
	GraphEndpoint,
	GRAPHS_ENDPOINT_PREFIX
} from "~/lib/common/app/graph/endpoints/graph.endpoint";

import { GraphEntity } from "./graph.entity";
import { GraphService } from "./graph.service";
import { UseAuth } from "../auth/auth.guard";

/**
 * The main controller for [graphs]{@link GraphDto}.
 */
@ApiTags("Graphs")
@Controller(GRAPHS_ENDPOINT_PREFIX)
@UseAuth()
export class GraphController implements GraphEndpoint<GraphEntity> {
	/**
	 * Constructor with "dependency injection"
	 *
	 * @param service injected
	 */
	public constructor(private readonly service: GraphService) {}

	/** @inheritDoc */
	@ApiOkResponse({ type: GraphResultsDto })
	@Get()
	public findAndCount(@Query() { where, ...params }: GraphQueryDto) {
		return this.service.findAndCount(where, params);
	}

	/** @inheritDoc */
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
