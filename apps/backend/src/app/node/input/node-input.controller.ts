import {
	Body,
	Controller,
	Delete,
	Param,
	Patch,
	Post,
	UseInterceptors
} from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import {
	NodeInputCreateDto,
	NodeInputDto,
	NodeInputUpdateDto
} from "~/lib/common/app/node/dtos/input";
import {
	generateNodeInputsEndpoint,
	NodeInputEndpoint
} from "~/lib/common/app/node/endpoints";
import { EntityId } from "~/lib/common/dtos/entity";
import { UnshiftParameters } from "~/lib/common/types";

import { NodeInputEntity } from "./node-input.entity";
import { NodeInputService } from "./node-input.service";
import { UseAuth } from "../../auth/auth.guard";
import { NodeEntity } from "../node.entity";
import {
	ApiNodeParam,
	NodeInterceptedParam,
	NodeInterceptor
} from "../node.interceptor";

/** @internal */
type EndpointBase = NodeInputEndpoint<NodeInputEntity>;
/** @internal */
type EndpointTransformed = {
	// Adds a Node as a first parameter for each function
	[K in keyof EndpointBase]: UnshiftParameters<EndpointBase[K], [NodeEntity]>;
};

/**
 * {@link NodeInputEntity} controller
 */
@ApiTags("Node inputs")
@Controller(
	generateNodeInputsEndpoint(
		`:${NodeInterceptor.PATH_PARAM}` as unknown as EntityId
	)
)
@UseAuth()
@UseInterceptors(NodeInterceptor)
export class NodeInputController implements EndpointTransformed {
	/**
	 * Constructor with "dependency injection"
	 *
	 * @param service injected
	 */
	public constructor(private readonly service: NodeInputService) {}

	@ApiCreatedResponse({ type: NodeInputDto })
	@ApiNodeParam()
	@Post()
	public create(
		@NodeInterceptedParam() node: NodeEntity,
		@Body() body: NodeInputCreateDto
	) {
		return this.service.createFromNode(node, body);
	}

	@ApiNodeParam()
	@ApiOkResponse({ type: NodeInputDto })
	@Patch("/:id")
	public update(
		@NodeInterceptedParam() node: NodeEntity,
		@Param("id") id: number,
		@Body() body: NodeInputUpdateDto
	) {
		return this.service.updateFromNode(node, id, body);
	}

	@ApiNodeParam()
	@ApiOkResponse({ type: NodeInputDto })
	@Delete("/:id")
	public delete(
		@NodeInterceptedParam() node: NodeEntity,
		@Param("id") id: number
	) {
		return this.service.deleteFromNode(node, id);
	}
}
