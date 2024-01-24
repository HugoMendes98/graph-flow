const nxPreset = require("@nx/jest/preset").default;
const path = require("path");

/**
 * @type {import("jest").Config}
 */
module.exports = {
	...nxPreset,
	coverageReporters: ["text"],
	watchPlugins: [
		"jest-watch-typeahead/filename",
		"jest-watch-typeahead/testname"
	]
};
