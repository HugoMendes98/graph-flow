const nxPreset = require("@nx/jest/preset").default;
const path = require("path");

/**
 * @type {import("jest").Config}
 */
module.exports = {
	...nxPreset,
	coverageReporters: ["text"],
	setupFilesAfterEnv: [path.join(__dirname, "./tools/jest/jest-extended.ts")],
	// eslint-disable-next-line @cspell/spellchecker -- plugin names
	watchPlugins: ["jest-watch-typeahead/filename", "jest-watch-typeahead/testname"]
};
