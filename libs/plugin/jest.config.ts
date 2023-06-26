export default {
	coverageDirectory: "../../coverage/libs/plugins",
	displayName: "plugins",
	globals: {
		"ts-jest": {
			tsconfig: "<rootDir>/tsconfig.spec.json"
		}
	},
	moduleFileExtensions: ["ts", "js", "html"],
	preset: "../../jest.preset.js",
	transform: {
		"^.+\\.[tj]s$": "ts-jest"
	}
};
