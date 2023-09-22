import { plainToInstance } from "class-transformer";

import { NodeBehaviorTriggerDto, NodeBehaviorVariableDto } from "./behaviors";
import { NodeBehaviorType } from "./behaviors/node-behavior.type";
import { NodeTriggerCronDto, NodeTriggerType } from "./behaviors/triggers";
import { NodeKindType } from "./kind/node-kind.type";
import { NodeCreateDto } from "./node.create.dto";
import { NodeUpdateDto } from "./node.update.dto";
import { transformOptions } from "../../../options";

describe("NodeUpdateDto", () => {
	describe("Behavior property", () => {
		it("should transform `behavior=VARIABLE` correctly (partial update)", () => {
			const toTransform = {
				behavior: { type: NodeBehaviorType.VARIABLE },
				kind: { active: true, type: NodeKindType.TEMPLATE },
				name: "a node"
			} as const satisfies NodeUpdateDto;

			const transformed = plainToInstance(
				NodeCreateDto,
				toTransform,
				transformOptions
			) as typeof toTransform;

			expect(transformed.behavior).toBeInstanceOf(NodeBehaviorVariableDto);
			expect(transformed.behavior.type).toBe(toTransform.behavior.type);
		});

		it("should transform `behavior=TRIGGER` correctly (with nested trigger content)", () => {
			const toTransform = {
				behavior: {
					trigger: { cron: "* * * * *", type: NodeTriggerType.CRON },
					type: NodeBehaviorType.TRIGGER
				},
				kind: { active: true, type: NodeKindType.TEMPLATE },
				name: "a node"
			} as const satisfies NodeUpdateDto;

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
	});

	describe("Kind property", () => {
		it("should transform `kind=EDGE` correctly", () => {
			const toTransform = {
				kind: { position: { x: 11, y: 12 }, type: NodeKindType.EDGE },
				name: "a node"
			} as const satisfies NodeUpdateDto;

			const transformed = plainToInstance(
				NodeUpdateDto,
				toTransform,
				transformOptions
			) as typeof toTransform;

			expect(transformed.kind.type).toBe(toTransform.kind.type);
			expect(transformed.kind.position.x).toBe(toTransform.kind.position.x);
			expect(transformed.kind.position.y).toBe(toTransform.kind.position.y);

			// -----------------

			const toTransformPartially = {
				kind: { type: NodeKindType.EDGE },
				name: "a node"
			} as const satisfies NodeUpdateDto;

			const transformedPartially = plainToInstance(
				NodeUpdateDto,
				toTransformPartially,
				transformOptions
			) as typeof toTransform;

			expect(transformedPartially.kind.type).toBe(toTransform.kind.type);
			expect(transformedPartially.kind.position).toBeUndefined();
		});

		it("should transform `kind=TEMPLATE` correctly", () => {
			const toTransform = {
				kind: { active: true, type: NodeKindType.TEMPLATE },
				name: "a node"
			} as const satisfies NodeUpdateDto;

			const transformed = plainToInstance(
				NodeUpdateDto,
				toTransform,
				transformOptions
			) as typeof toTransform;

			expect(transformed.kind.type).toBe(toTransform.kind.type);
			expect(transformed.kind.active).toBe(toTransform.kind.active);

			// ---------

			const toTransformPartially = {
				kind: { type: NodeKindType.TEMPLATE },
				name: "a node"
			} as const satisfies NodeUpdateDto;

			const transformedPartially = plainToInstance(
				NodeUpdateDto,
				toTransformPartially,
				transformOptions
			) as typeof toTransform;

			expect(transformedPartially.kind.type).toBe(toTransform.kind.type);
			expect(transformedPartially.kind.active).toBeUndefined();
		});
	});
});
