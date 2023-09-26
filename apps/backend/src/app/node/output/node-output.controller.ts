import { Body, Controller, Param, Patch, UseInterceptors } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { NodeOutputDto, NodeOutputUpdateDto } from "~/lib/common/app/node/dtos/output";
import { generateNodeOutputsEndpoint, NodeOutputEndpoint } from "~/lib/common/app/node/endpoints";
import { EntityId } from "~/lib/common/dtos/entity";
import { UnshiftParameters } from "~/lib/common/types";

import { NodeOutputEntity } from "./node-output.entity";
import { NodeOutputService } from "./node-output.service";
import { UseAuth } from "../../auth/auth.guard";
import { NodeEntity } from "../node.entity";
import { ApiNodeParam, NodeInterceptedParam, NodeInterceptor } from "../node.interceptor";

/** @internal */
type EndpointBase = NodeOutputEndpoint<NodeOutputEntity>;
/** @internal */
type EndpointTransformed = {
	// Adds a Node as a first parameter for each function
	[K in keyof EndpointBase]: UnshiftParameters<EndpointBase[K], [NodeEntity]>;
};

/**
 * {@link NodeOutputEntity} controller
 */
@ApiTags("Node outputs")
@Controller(generateNodeOutputsEndpoint(`:${NodeInterceptor.PATH_PARAM}` as unknown as EntityId))
@UseAuth()
@UseInterceptors(NodeInterceptor)
export class NodeOutputController implements EndpointTransformed {
	/**
	 * Constructor with "dependency injection"
	 *
	 * @param service injected
	 */
	public constructor(private readonly service: NodeOutputService) {}

	@ApiNodeParam()
	@ApiOkResponse({ type: NodeOutputDto })
	@Patch("/:id")
	public update(
		@NodeInterceptedParam() node: NodeEntity,
		@Param("id") id: number,
		@Body() body: NodeOutputUpdateDto
	) {
		return this.service
			.findByNodeId(node._id, id)
			.then(({ _id }) => this.service.update(_id, body));
	}
}
