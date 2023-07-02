import { JestConfigWithTsJest } from "ts-jest";

export default {
	coverageDirectory: "../../coverage/apps/backend",
	displayName: "backend",
	globalSetup: "<rootDir>/test/support/global/setup.ts",
	globalTeardown: "<rootDir>/test/support/global/teardown.ts",
	moduleFileExtensions: ["ts", "js", "html"],
	modulePathIgnorePatterns: ["<rootDir>/test/support/"],
	preset: "../../jest.preset.js",
	setupFilesAfterEnv: ["<rootDir>/test/support/setup.ts"],
	testEnvironment: "node",
	transform: {
		"^.+\\.[tj]s$": [
			"ts-jest",
			{
				tsconfig: "<rootDir>/tsconfig.spec.json"
			}
		]
	}
} satisfies JestConfigWithTsJest;
