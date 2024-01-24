import * as fs from "fs";
import * as path from "path";

/**
 * Run the postinstall command
 */
function bootstrap() {
	const pathRoot = path.join(__dirname, "../../");
	const pathApps = path.join(pathRoot, "apps");
	const pathBack = path.join(pathApps, "backend");
	const pathFront = path.join(pathApps, "frontend");

	// Copy the config template for the backend
	const configPath = path.join(pathBack, "src/config.ts");
	if (!fs.existsSync(configPath)) {
		const configTemplate = path.join(
			pathBack,
			"src/configuration/config.template"
		);
		fs.copyFileSync(configTemplate, configPath);
	}

	const frontDocPath = path.join(pathFront, ".storybook/documentation.json");

	for (const docPath of [frontDocPath]) {
		if (!fs.existsSync(docPath)) {
			fs.writeFileSync(
				docPath,
				JSON.stringify({ _info: "Empty file for eslint+typescript." })
			);
		}
	}

	// TODO: find a better solution (fork, webpack resolve (and jest), ts-path, ...?)
	for (const target of ["cjs", "esm2015", "esm5"]) {
		// Quickest way to modify the code locally
		const CODE_CHUNK = "object[propertyName] !== null && ";
		const file = path.join(
			pathRoot,
			"node_modules/class-validator",
			target,
			"decorator/common/IsOptional.js"
		);

		// To really make the difference between `null` and `undefined`.
		// Need this for the `PartialType` from `@nestjs/swagger`
		const content = fs.readFileSync(file).toString();
		const modified = content.replace(CODE_CHUNK, "");
		if (content !== modified) {
			fs.writeFileSync(file, modified);
		}
	}
}

bootstrap();
