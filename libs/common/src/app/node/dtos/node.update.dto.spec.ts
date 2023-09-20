import { plainToInstance } from "class-transformer";

import { NodeKindType } from "./kind";
import { NodeUpdateDto } from "./node.update.dto";
import { transformOptions } from "../../../options";

describe("NodeUpdateDto", () => {
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
