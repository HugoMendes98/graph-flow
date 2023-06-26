import { nxE2EPreset } from "@nx/cypress/plugins/cypress-preset";
import { defineConfig } from "cypress";
import { globalSetup } from "~/app/backend/e2e/global/setup";
import { globalTeardown } from "~/app/backend/e2e/global/teardown";

const e2eNodeEvents: Cypress.ResolvedConfigOptions["setupNodeEvents"] = on => {
	let initialized = false;

	const setup = () =>
		globalSetup({ prefix: "frontend-e2e-setup" }).then(() => (initialized = true));
	const teardown = () =>
		globalTeardown({ prefix: "frontend-e2e-teardown" }).then(() => (initialized = false));

	on("before:browser:launch", async () => {
		if (!initialized) {
			await setup();
		}
		// TODO: A way to detect when the browser closes?
	});
	on("before:run", async () => {
		if (!initialized) {
			await setup();
		}
	});
	on("after:run", async () => {
		if (initialized) {
			await teardown();
		}
	});

	// FIXME: `after:run` not run on watch mode
};

export default defineConfig({
	e2e: {
		...nxE2EPreset(__dirname),
		setupNodeEvents: e2eNodeEvents
	},
	experimentalInteractiveRunEvents: true,
	experimentalStudio: true,
	// Just in case
	setupNodeEvents: e2eNodeEvents
});
