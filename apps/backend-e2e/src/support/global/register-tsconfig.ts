import * as commentJson from "comment-json";
import * as fs from "fs";
import * as path from "path";
import { register } from "tsconfig-paths";

// Global setup and teardown do not use the given tsconfig for tests.
//	So this file forces to use a tsconfig, at least for the paths.

const cwd = path.join(__dirname, "../../../../..");
const tsConfigContent = fs
	.readFileSync(path.join(cwd, "tsconfig.e2e.json"))
	.toString();
const tsConfig = commentJson.parse(
	tsConfigContent
) as unknown as typeof import("../../../../../tsconfig.e2e.json");

register({ baseUrl: cwd, cwd, paths: tsConfig.compilerOptions.paths });
