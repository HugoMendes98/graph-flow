import { plainToClass } from "class-transformer";

import { NodeBehaviorType } from "./behaviors/node-behavior.type";
import { NodeKindType } from "./kind/node-kind.type";
import { NodeQueryDto } from "./node.query.dto";
import { transformOptions } from "../../../options";

describe("NodeQueryDto", () => {
	it("should convert discriminated types", () => {
		const toTransform1 = {
			where: { behavior: { type: NodeBehaviorType.TRIGGER } }
		} as const satisfies NodeQueryDto;

		const transformed1 = plainToClass(NodeQueryDto, toTransform1, transformOptions);
		expect(transformed1.where?.behavior?.type).toBe(toTransform1.where.behavior.type);

		const toTransform2 = {
			where: { kind: { type: NodeKindType.TEMPLATE } }
		} as const satisfies NodeQueryDto;
		const transformed2 = plainToClass(NodeQueryDto, toTransform2, transformOptions);
		expect(transformed2.where?.kind?.type).toBe(toTransform2.where.kind.type);
	});
});
