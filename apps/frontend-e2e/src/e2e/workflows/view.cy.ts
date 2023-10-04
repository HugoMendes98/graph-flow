import { DbE2eHelper } from "~/app/backend/e2e/db-e2e/db-e2e.helper";
import { BASE_SEED } from "~/lib/common/seeds";

describe("Workflow view", () => {
	const dbHelper = DbE2eHelper.getHelper("base");
	const db = dbHelper.db as typeof BASE_SEED;

	before(() => cy.dbRefresh("base"));

	const { workflows } = db;
	const [workflowActivable] = workflows;

	beforeEach(() => {
		const { email, password } = db.users[0];
		cy.authConnectAs(email, password);
	});

	it("should open a workflow", () => {
		cy.visit(`/workflows/${workflowActivable._id}`);

		/* ==== Generated with Cypress Studio ==== */
		cy.get("#mat-tab-label-0-0 > .mdc-tab__content > span span").should(
			"contain",
			workflowActivable.name
		);
		/* ==== End Cypress Studio ==== */
	});

	it("should have a not-found message when opening an unknown workflow", () => {
		const unknownId = Math.max(...workflows.map(({ _id }) => _id)) + 1;
		cy.visit(`/workflows/${unknownId}`);

		/* ==== Generated with Cypress Studio ==== */
		cy.get("#mat-tab-label-0-0 > .mdc-tab__content > span span").should(
			"contain",
			"An error occurred"
		);
		/* ==== End Cypress Studio ==== */
	});
});
