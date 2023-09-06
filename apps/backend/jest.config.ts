import { JestConfigWithTsJest } from "ts-jest";

export default {
	collectCoverageFrom: [
		"<rootDir>/src/**/*.ts",
		// The controllers are mainly tested with the e2e tests,
		//	so their code coverage are not really useful
		"!<rootDir>/src/**/*.controller.ts",
		"!<rootDir>/src/**/index.ts",
		// Used to start an application (also in e2e)
		"!<rootDir>/src/bootstrap.ts",
		"!<rootDir>/src/main.ts"
	],
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
