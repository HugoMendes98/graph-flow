import {
	BadRequestException,
	CallHandler,
	createParamDecorator,
	ExecutionContext,
	Injectable,
	NestInterceptor
} from "@nestjs/common";
import { ApiParam } from "@nestjs/swagger";
import { ParameterObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
import { isInt } from "class-validator";
import { Request } from "express";

import { NodeEntity } from "./node.entity";
import { NodeService } from "./node.service";

// eslint-disable-next-line no-use-before-define -- Only for typing
type RequestParams = Partial<Record<typeof NodeInterceptor.NODE_TOKEN, NodeEntity>> &
	// eslint-disable-next-line no-use-before-define -- Only for typing
	Record<typeof NodeInterceptor.PATH_PARAM, string>;

@Injectable()
export class NodeInterceptor implements NestInterceptor {
	/**
	 * The param the path must have for this interceptor
	 */
	public static readonly PATH_PARAM = "nodeId";
	/**
	 * The "token" it uses to share the found {@link NodeEntity} through request
	 */
	public static readonly NODE_TOKEN = `__node__`;

	/**
	 * Constructor with "dependency injection"
	 *
	 * @param service injected
	 */
	public constructor(private readonly service: NodeService) {}

	/** @inheritDoc */
	public intercept(context: ExecutionContext, next: CallHandler) {
		const request = context.switchToHttp().getRequest<Request<RequestParams>>();
		const nodeId = request.params[NodeInterceptor.PATH_PARAM];

		const id = +nodeId;
		if (!isInt(id)) {
			throw new BadRequestException("The node id must be a number");
		}

		return this.service.findById(id).then(node => {
			this.service.clearEM();

			request.params[NodeInterceptor.NODE_TOKEN] = node;
			return next.handle();
		});
	}
}

/**
 * Injects the intercepted Node from the {@link NodeInterceptor} into a parameter.
 */
export const NodeInterceptedParam = createParamDecorator<never, ExecutionContext>(
	(_, context) =>
		context.switchToHttp().getRequest<Request<RequestParams>>().params[
			NodeInterceptor.NODE_TOKEN
		]
);

/**
 * The swagger documentation does not contain the param field when using a path parameter in the Controller decorator.
 * This adds the missing fields.
 *
 * @param options Some additional options
 * @returns The decorator that adds the swagger field
 */
export const ApiNodeParam = (options: Pick<ParameterObject, "description" | "example"> = {}) =>
	ApiParam({
		...options,
		name: NodeInterceptor.PATH_PARAM,
		required: true,
		type: Number
	});
