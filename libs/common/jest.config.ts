import { JestConfigWithTsJest } from "ts-jest";

export default {
	coverageDirectory: "../../coverage/libs/common",
	displayName: "lib",
	moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
	preset: "../../jest.preset.js",
	testEnvironment: "node",
	transform: {
		"^.+\\.[tj]sx?$": [
			"ts-jest",
			{
				tsconfig: "<rootDir>/tsconfig.spec.json"
			}
		]
	}
} satisfies JestConfigWithTsJest;
