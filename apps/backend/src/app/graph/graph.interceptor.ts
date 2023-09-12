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

import { GraphEntity } from "./graph.entity";
import { GraphService } from "./graph.service";

// eslint-disable-next-line no-use-before-define -- Only for typing
type RequestParams = Partial<Record<typeof GraphInterceptor.GRAPH_TOKEN, GraphEntity>> &
	// eslint-disable-next-line no-use-before-define -- Only for typing
	Record<typeof GraphInterceptor.PATH_PARAM, string>;

/**
 * An interceptor for sub-resources of graph.
 *
 * It tests that the value is a number and that the graphs exists.
 * The graph can be retrieved in the Request params or simply with {@link GraphInterceptedParam}.
 *
 * Example: `/graphs/5/arcs` -> reads the Graph[id:5]
 */
@Injectable()
export class GraphInterceptor implements NestInterceptor {
	/**
	 * The param the path must have for this interceptor
	 */
	public static readonly PATH_PARAM = "graphId";
	/**
	 * The "token" it uses to share the found {@link GraphEntity}
	 */
	public static readonly GRAPH_TOKEN = `__graph__`;

	/**
	 * Constructor with "dependency injection"
	 *
	 * @param service injected
	 */
	public constructor(private readonly service: GraphService) {}

	/**
	 * @inheritDoc
	 */
	public intercept(context: ExecutionContext, next: CallHandler) {
		const request = context.switchToHttp().getRequest<Request<RequestParams>>();
		const graphId = request.params[GraphInterceptor.PATH_PARAM];

		const id = +graphId;
		if (!isInt(id)) {
			throw new BadRequestException("The graph id must be a number");
		}

		return this.service.findById(id).then(graph => {
			this.service.clearEM();

			request.params[GraphInterceptor.GRAPH_TOKEN] = graph;
			return next.handle();
		});
	}
}

/**
 * Injects the intercepted Graph from the {@link GraphInterceptor} into a parameter.
 */
export const GraphInterceptedParam = createParamDecorator<never, ExecutionContext>(
	(_, context) =>
		context.switchToHttp().getRequest<Request<RequestParams>>().params[
			GraphInterceptor.GRAPH_TOKEN
		]
);

/**
 * The swagger documentation does not contain the param field when using a path parameter in the Controller decorator.
 * This adds the missing fields.
 *
 * @param options Some additional options
 * @returns The decorator that adds the swagger field
 */
export const ApiGraphParam = (options: Pick<ParameterObject, "description" | "example"> = {}) =>
	ApiParam({
		...options,
		name: GraphInterceptor.PATH_PARAM,
		required: true,
		type: Number
	});
