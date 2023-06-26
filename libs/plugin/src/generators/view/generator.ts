import { componentGenerator } from "@nx/angular/generators";
import { Tree } from "@nx/devkit";

import { ViewGeneratorSchema } from "./schema";

/**
 * @param tree The tree for this generator
 * @param options The options for this generator
 */
export default async function (tree: Tree, options: ViewGeneratorSchema) {
	const { dev, ...ngOptions } = options;

	let name = `views/${options.name}`;
	if (dev) {
		name = `../dev/${name}`;
	}

	await componentGenerator(tree, {
		...ngOptions,
		name,
		skipSelector: true,
		type: "view"
	});
}
