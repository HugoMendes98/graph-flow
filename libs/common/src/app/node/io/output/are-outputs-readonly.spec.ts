import { areNodeOutputsReadonlyOnUpdate } from "./are-outputs-readonly";
import { NodeBehaviorType } from "../../dtos/behaviors/node-behavior.type";

describe("areNodeOutputsReadonly", () => {
	describe("areNodeOutputsReadonlyOnUpdate", () => {
		it("should be readonly", () => {
			for (const behavior of [
				NodeBehaviorType.FUNCTION,
				NodeBehaviorType.PARAMETER_OUT,
				NodeBehaviorType.TRIGGER,
				NodeBehaviorType.REFERENCE
			] satisfies NodeBehaviorType[]) {
				expect(areNodeOutputsReadonlyOnUpdate(behavior)).toBe(true);
			}
		});

		it("should not be readonly", () => {
			for (const behavior of [
				NodeBehaviorType.CODE,
				NodeBehaviorType.PARAMETER_IN,
				NodeBehaviorType.VARIABLE
			] satisfies NodeBehaviorType[]) {
				expect(areNodeOutputsReadonlyOnUpdate(behavior)).toBe(false);
			}
		});
	});
});
