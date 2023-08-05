import { JestConfigWithTsJest } from "ts-jest";

export default {
	collectCoverageFrom: ["<rootDir>/src/**/*.ts", "!<rootDir>/src/**/index.ts"],
	displayName: "frontend",
	preset: "../../jest.preset.js",
	setupFilesAfterEnv: ["<rootDir>/test/setup.ts"],
	snapshotSerializers: [
		"jest-preset-angular/build/serializers/no-ng-attributes",
		"jest-preset-angular/build/serializers/ng-snapshot",
		"jest-preset-angular/build/serializers/html-comment"
	],
	transform: {
		"^.+\\.[tj]sx?$": [
			"jest-preset-angular",
			{
				stringifyContentPathRegex: "\\.(html|svg)$",
				tsconfig: "<rootDir>/tsconfig.spec.json"
			}
		],
		// eslint-disable-next-line sort-keys -- the order matters
		"^.+\\.(ts|mjs|js|html)$": "jest-preset-angular"
	},
	transformIgnorePatterns: ["node_modules/(?!.*\\.mjs$)"]
} satisfies JestConfigWithTsJest;
