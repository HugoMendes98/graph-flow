import { composePlugins, withNx } from "@nx/webpack";
import { deepmerge } from "deepmerge-ts";
import * as path from "path";
import nodeExternals from "webpack-node-externals";

// Nx plugins for webpack.
export default composePlugins(withNx(), config => {
	// Update the webpack config as needed here.
	// e.g. `config.plugins.push(new MyPlugin())`

	// Remove the default `nodeExternals`
	(config.externals as []).splice(0, 1);

	// Need to keep the `mapped-types` in common code, so it can be tested and reused
	// However, the swagger module is needed for the openApi.
	const moduleToAlias = "@nestjs/mapped-types";
	const moduleAlias = "@nestjs/swagger";

	return deepmerge(config, {
		externals: [
			nodeExternals({
				allowlist: [moduleToAlias]
			}),
			({ context, dependencyType, request }, callback) => {
				if (
					context &&
					request &&
					request.startsWith(moduleToAlias) &&
					context.startsWith(path.resolve(__dirname, "../..", "node_modules"))
				) {
					// When the module is used from another `node_module`,
					// load it normally (as external: https://webpack.js.org/configuration/externals/)
					callback(undefined, `${dependencyType ?? "commonjs"} ${request}`);
					return;
				}

				// Default callback so the alias is taken
				callback();
			}
		],
		resolve: {
			alias: {
				// In app code, use the alias instead
				[moduleToAlias]: moduleAlias
			}
		}
	} satisfies typeof config);
});
