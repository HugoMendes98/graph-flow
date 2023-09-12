import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import {
	NodeCreateDto,
	NodeDto,
	NodeQueryDto,
	NodeResultsDto,
	NodeUpdateDto
} from "~/lib/common/app/node/dtos";
import { NodeEndpoint, NODES_ENDPOINT_PREFIX } from "~/lib/common/app/node/endpoints";

import { NodeEntity } from "./node.entity";
import { NodeService } from "./node.service";
import { UseAuth } from "../auth/auth.guard";

/**
 * The main controller for [nodes]{@link NodeDto}.
 */
@ApiTags("Nodes")
@Controller(NODES_ENDPOINT_PREFIX)
@UseAuth()
export class NodeController implements NodeEndpoint<NodeEntity> {
	/**
	 * Constructor with "dependency injection"
	 *
	 * @param service injected
	 */
	public constructor(private readonly service: NodeService) {}

	/** @inheritDoc */
	@ApiOkResponse({ type: NodeResultsDto })
	@Get()
	public findAndCount(@Query() { where, ...params }: NodeQueryDto) {
		return this.service.findAndCount(where, params);
	}

	/** @inheritDoc */
	@ApiOkResponse({ type: NodeDto })
	@Get("/:id")
	public findById(@Param("id") id: number) {
		return this.service.findById(id);
	}

	/** @inheritDoc */
	@ApiCreatedResponse({ type: NodeDto })
	@Post()
	public create(@Body() body: NodeCreateDto) {
		return this.service.create(body);
	}

	/** @inheritDoc */
	@ApiOkResponse({ type: NodeDto })
	@Patch("/:id")
	public update(@Param("id") id: number, @Body() body: NodeUpdateDto) {
		return this.service.update(id, body);
	}

	/** @inheritDoc */
	@ApiOkResponse({ type: NodeDto })
	@Delete("/:id")
	public delete(@Param("id") id: number) {
		return this.service.delete(id);
	}
}
