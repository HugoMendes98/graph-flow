import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import {
	NodeCreateDto,
	NodeDto,
	NodeQueryDto,
	NodeResultsDto,
	NodeUpdateDto
} from "~/lib/common/dtos/node";
import { NodeEndpoint, NODES_ENDPOINT_PREFIX } from "~/lib/common/endpoints";

import { NodeService } from "./node.service";

/**
 * The main controller for [nodes]{@link NodeDto}.
 */
@ApiTags("Nodes")
@Controller(NODES_ENDPOINT_PREFIX)
export class NodeController implements NodeEndpoint {
	public constructor(private readonly service: NodeService) {}

	@ApiOkResponse({ type: NodeResultsDto })
	@Get()
	public findAndCount(@Query() { where, ...params }: NodeQueryDto) {
		return this.service.findAndCount(where, params);
	}

	@ApiOkResponse({ type: NodeDto })
	@Get("/:id")
	public findById(@Param("id") id: number) {
		return this.service.findById(id);
	}

	@ApiCreatedResponse({ type: NodeDto })
	@Post()
	public create(@Body() body: NodeCreateDto) {
		return this.service.create(body);
	}

	@ApiOkResponse({ type: NodeDto })
	@Patch("/:id")
	public update(@Param("id") id: number, @Body() body: NodeUpdateDto) {
		return this.service.update(id, body);
	}

	@ApiOkResponse({ type: NodeDto })
	@Delete("/:id")
	public delete(@Param("id") id: number) {
		return this.service.delete(id);
	}
}
