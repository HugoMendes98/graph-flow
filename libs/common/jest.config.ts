import { JestConfigWithTsJest } from "ts-jest";

export default {
	collectCoverageFrom: [
		"<rootDir>/src/**/*.ts",
		"!<rootDir>/src/**/index.ts",
		"!<rootDir>/src/seeds/**"
	],
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
