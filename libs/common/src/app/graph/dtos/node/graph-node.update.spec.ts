import { plainToInstance } from "class-transformer";

import { GraphNodeKindUpdateDto, GraphNodeUpdateDto } from "./graph-node.update.dto";
import { transformOptions } from "../../../../options";

describe("GraphNodeUpdateDto", () => {
	describe("Transformation", () => {
		it("should transform with partial content", () => {
			const toTransform = { kind: {} } as const satisfies GraphNodeUpdateDto;

			const transformed = plainToInstance(GraphNodeUpdateDto, toTransform, transformOptions);

			expect(transformed.kind).toBeInstanceOf(GraphNodeKindUpdateDto);
			expect(transformed.name).toBeUndefined();
		});
	});
});
