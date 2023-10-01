import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

import {
	NodeBehaviorParameterInputDto,
	NodeBehaviorParameterOutputDto,
	NodeBehaviorTriggerDto,
	NodeBehaviorVariableDto
} from "./behaviors";
import { NodeBehaviorType } from "./behaviors/node-behavior.type";
import { NodeTriggerCronDto, NodeTriggerType } from "./behaviors/triggers";
import { NodeKindEdgeDto, NodeKindTemplateDto } from "./kind";
import { NodeKindType } from "./kind/node-kind.type";
import { NodeCreateDto } from "./node.create.dto";
import { transformOptions, validatorOptions } from "../../../options";

describe("NodeCreateDto", () => {
	describe("Behavior property", () => {
		it("should transform `behavior=VARIABLE` correctly", () => {
			const toTransform = {
				behavior: { type: NodeBehaviorType.VARIABLE, value: 10 },
				kind: { active: true, type: NodeKindType.TEMPLATE },
				name: "a node"
			} as const satisfies NodeCreateDto;

			const transformed = plainToInstance(
				NodeCreateDto,
				toTransform,
				transformOptions
			) as typeof toTransform;

			expect(transformed.behavior).toBeInstanceOf(NodeBehaviorVariableDto);

			expect(transformed.behavior.type).toBe(toTransform.behavior.type);
			expect(transformed.behavior.value).toBe(toTransform.behavior.value);
		});

		it("should transform `behavior=TRIGGER` correctly", () => {
			const toTransform = {
				behavior: {
					trigger: { cron: "* * * * *", type: NodeTriggerType.CRON },
					type: NodeBehaviorType.TRIGGER
				},
				kind: { active: true, type: NodeKindType.TEMPLATE },
				name: "a node"
			} as const satisfies NodeCreateDto;

			const transformed = plainToInstance(
				NodeCreateDto,
				toTransform,
				transformOptions
			) as typeof toTransform;

			expect(transformed.behavior).toBeInstanceOf(NodeBehaviorTriggerDto);
			expect(transformed.behavior.trigger).toBeInstanceOf(NodeTriggerCronDto);

			expect(transformed.behavior.type).toBe(toTransform.behavior.type);
			expect(transformed.behavior.trigger.type).toBe(toTransform.behavior.trigger.type);
			expect(transformed.behavior.trigger.cron).toBe(toTransform.behavior.trigger.cron);
		});

		it("should fail when creating PARAMETER nodes", async () => {
			const nodeIn: NodeCreateDto = {
				behavior: {
					__node_input: 1,
					type: NodeBehaviorType.PARAMETER_IN
				} satisfies NodeBehaviorParameterInputDto as never,
				kind: { active: false, type: NodeKindType.TEMPLATE },
				name: "node"
			};

			const transformedIn = plainToInstance(NodeCreateDto, nodeIn, transformOptions);
			expect(transformedIn.behavior).not.toBeInstanceOf(NodeBehaviorParameterInputDto);
			expect(await validate(transformedIn)).toHaveLength(1);

			const nodeOut: NodeCreateDto = {
				behavior: {
					__node_output: 1,
					type: NodeBehaviorType.PARAMETER_OUT
				} satisfies NodeBehaviorParameterOutputDto as never,
				kind: { active: false, type: NodeKindType.TEMPLATE },
				name: "node"
			};

			const transformedOut = plainToInstance(NodeCreateDto, nodeOut, transformOptions);
			expect(transformedOut.behavior).not.toBeInstanceOf(NodeBehaviorParameterOutputDto);
			expect(await validate(transformedOut)).toHaveLength(1);
		});
	});

	describe("Kind property", () => {
		it("should transform `kind=EDGE` correctly", () => {
			const toTransform = {
				behavior: { type: NodeBehaviorType.VARIABLE, value: 0 },
				kind: { __graph: 10, position: { x: 11, y: 12 }, type: NodeKindType.EDGE },
				name: "a node"
			} as const satisfies NodeCreateDto;

			const transformed = plainToInstance(
				NodeCreateDto,
				toTransform,
				transformOptions
			) as typeof toTransform;

			expect(transformed.kind).toBeInstanceOf(NodeKindEdgeDto);

			expect(transformed.kind.type).toBe(toTransform.kind.type);
			expect(transformed.kind.__graph).toBe(toTransform.kind.__graph);
			expect(transformed.kind.position.x).toBe(toTransform.kind.position.x);
			expect(transformed.kind.position.y).toBe(toTransform.kind.position.y);
		});

		it("should validate `kind=EDGE` correctly", async () => {
			const toTransform = {
				behavior: { type: NodeBehaviorType.VARIABLE, value: 0 },
				kind: { __graph: 10, position: { x: 11, y: 12 }, type: NodeKindType.EDGE },
				name: "a node"
			} as const satisfies NodeCreateDto;

			const transformed = plainToInstance(
				NodeCreateDto,
				toTransform,
				transformOptions
			) as typeof toTransform;

			const errors = await validate(transformed, validatorOptions);
			expect(errors).toHaveLength(0);
		});

		it("should transform `kind=TEMPLATE` correctly", () => {
			const toTransform = {
				behavior: { type: NodeBehaviorType.VARIABLE, value: 0 },
				kind: { active: true, type: NodeKindType.TEMPLATE },
				name: "a node"
			} as const satisfies NodeCreateDto;

			const transformed = plainToInstance(
				NodeCreateDto,
				toTransform,
				transformOptions
			) as typeof toTransform;

			expect(transformed.kind).toBeInstanceOf(NodeKindTemplateDto);

			expect(transformed.kind.type).toBe(toTransform.kind.type);
			expect(transformed.kind.active).toBe(toTransform.kind.active);
		});
	});
});
