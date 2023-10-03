import {
	areNodeInputsReadonlyOnCreate,
	areNodeInputsReadonlyOnDelete,
	areNodeInputsReadonlyOnUpdate
} from "./are-inputs-readonly";
import { NodeBehaviorType } from "../../dtos/behaviors/node-behavior.type";

describe("areNodeOutputsReadonly", () => {
	describe("areNodeInputsReadonlyOnCreate", () => {
		it("should be readonly", () => {
			for (const behavior of [
				NodeBehaviorType.FUNCTION,
				NodeBehaviorType.PARAMETER_IN,
				NodeBehaviorType.PARAMETER_OUT,
				NodeBehaviorType.TRIGGER,
				NodeBehaviorType.REFERENCE,
				NodeBehaviorType.VARIABLE
			] satisfies NodeBehaviorType[]) {
				expect(areNodeInputsReadonlyOnCreate(behavior)).toBeTrue();
			}
		});

		it("should not be readonly", () => {
			for (const behavior of [NodeBehaviorType.CODE] satisfies NodeBehaviorType[]) {
				expect(areNodeInputsReadonlyOnCreate(behavior)).toBeFalse();
			}
		});
	});

	describe("areNodeOutputsReadonlyOnUpdate", () => {
		it("should be readonly", () => {
			for (const behavior of [
				NodeBehaviorType.FUNCTION,
				NodeBehaviorType.PARAMETER_IN,
				NodeBehaviorType.TRIGGER,
				NodeBehaviorType.REFERENCE,
				NodeBehaviorType.VARIABLE
			] satisfies NodeBehaviorType[]) {
				expect(areNodeInputsReadonlyOnUpdate(behavior)).toBeTrue();
			}
		});

		it("should not be readonly", () => {
			for (const behavior of [
				NodeBehaviorType.CODE,
				NodeBehaviorType.PARAMETER_OUT
			] satisfies NodeBehaviorType[]) {
				expect(areNodeInputsReadonlyOnUpdate(behavior)).toBeFalse();
			}
		});
	});

	describe("areNodeInputsReadonlyOnDelete", () => {
		it("should be readonly", () => {
			for (const behavior of [
				NodeBehaviorType.FUNCTION,
				NodeBehaviorType.PARAMETER_IN,
				NodeBehaviorType.PARAMETER_OUT,
				NodeBehaviorType.TRIGGER,
				NodeBehaviorType.REFERENCE,
				NodeBehaviorType.VARIABLE
			] satisfies NodeBehaviorType[]) {
				expect(areNodeInputsReadonlyOnDelete(behavior)).toBeTrue();
			}
		});

		it("should not be readonly", () => {
			for (const behavior of [NodeBehaviorType.CODE] satisfies NodeBehaviorType[]) {
				expect(areNodeInputsReadonlyOnDelete(behavior)).toBeFalse();
			}
		});
	});
});
