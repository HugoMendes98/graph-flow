const nxPreset = require("@nx/jest/preset").default;
const path = require("path");

/**
 * @type {import("jest").Config}
 */
module.exports = {
	...nxPreset,
	setupFilesAfterEnv: [path.join(__dirname, "./tools/jest/jest-extended.ts")]
};
