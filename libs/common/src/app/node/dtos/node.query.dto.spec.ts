import { plainToInstance } from "class-transformer";

import { NodeBehaviorType } from "./behaviors/node-behavior.type";
import { NodeKindType } from "./kind/node-kind.type";
import { NodeQueryDto } from "./node.query.dto";
import { EntityFilterValue } from "../../../endpoints";
import { transformOptions } from "../../../options";

describe("NodeQueryDto", () => {
	it("should convert discriminated types (where)", () => {
		const toTransform1 = {
			where: { behavior: { type: NodeBehaviorType.TRIGGER } }
		} as const satisfies NodeQueryDto;

		const transformed1 = plainToInstance(NodeQueryDto, toTransform1, transformOptions);
		expect(
			(transformed1.where?.behavior?.type as EntityFilterValue<unknown> | undefined)?.$eq
		).toBe(toTransform1.where.behavior.type);

		const toTransform2 = {
			where: { kind: { type: NodeKindType.TEMPLATE } }
		} as const satisfies NodeQueryDto;
		const transformed2 = plainToInstance(NodeQueryDto, toTransform2, transformOptions);
		expect(
			(transformed2.where?.kind?.type as EntityFilterValue<unknown> | undefined)?.$eq
		).toBe(toTransform2.where.kind.type);
	});

	it("should convert discriminated types (order)", () => {
		const toTransform1 = {
			order: [{ behavior: { type: "asc" } }]
		} as const satisfies NodeQueryDto;

		const transformed1 = plainToInstance(NodeQueryDto, toTransform1, transformOptions);
		expect(transformed1.order?.[0]?.behavior?.type).toBe(toTransform1.order[0].behavior.type);
	});
});
