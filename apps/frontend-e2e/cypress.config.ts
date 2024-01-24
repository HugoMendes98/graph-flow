import { nxE2EPreset } from "@nx/cypress/plugins/cypress-preset";
import { defineConfig } from "cypress";
import * as fs from "fs";
import { globalSetup } from "~/app/backend/e2e/global/setup";
import { globalTeardown } from "~/app/backend/e2e/global/teardown";

const e2eNodeEvents: Cypress.ResolvedConfigOptions["setupNodeEvents"] = on => {
	let initialized = false;

	const setup = () =>
		globalSetup({ prefix: "frontend-e2e-setup" }).then(
			() => (initialized = true)
		);
	const teardown = () =>
		globalTeardown({ prefix: "frontend-e2e-teardown" }).then(
			() => (initialized = false)
		);

	// Taken from https://docs.cypress.io/guides/guides/screenshots-and-videos#Delete-videos-for-specs-without-failing-or-retried-tests
	on(
		"after:spec",
		(spec: Cypress.Spec, results: CypressCommandLine.RunResult) => {
			if (!results || !results.video) {
				return;
			}

			// Do we have failures for any retry attempts?
			const failures = results.tests.some(test =>
				test.attempts.some(attempt => attempt.state === "failed")
			);
			if (!failures) {
				// delete the video if the spec passed and no tests retried
				fs.unlinkSync(results.video);
			}
		}
	);

	// Backend initialisation

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
		setupNodeEvents: e2eNodeEvents,
		videoCompression: true
	},
	experimentalInteractiveRunEvents: true,
	experimentalStudio: true,
	// Just in case
	setupNodeEvents: e2eNodeEvents,
	videoCompression: true
});
