import { DbE2eHelper } from "~/app/backend/e2e/db-e2e/db-e2e.helper";
import { BASE_SEED } from "~/lib/common/seeds";

describe("Workflows list", () => {
	const dbHelper = DbE2eHelper.getHelper("base");
	const db = dbHelper.db as typeof BASE_SEED;

	before(() => cy.dbRefresh("base"));

	beforeEach(() => {
		const { email, password } = db.users[0];
		cy.authConnectAs(email, password);
		cy.visit("/workflows");
	});

	describe("Sort", () => {
		it("should sort columns", () => {
			const { workflows } = db;
			const ids = workflows.map(({ _id }) => _id);
			const min = Math.min(...ids).toString();
			const max = Math.max(...ids).toString();

			/* ==== Generated with Cypress Studio ==== */
			cy.get(".cdk-column-_id > ui-list-table-header > .align-i-center > span").click();
			cy.get(".mdc-data-table__content > :nth-child(1) > .cdk-column-_id").should(
				"have.text",
				min
			);
			cy.get(".cdk-column-_id > ui-list-table-header > .align-i-center .mat-icon").should(
				"be.visible"
			);
			cy.get(".align-i-center > .ng-star-inserted > .mat-icon").click();
			cy.get(".mdc-data-table__content > :nth-child(1) > .cdk-column-_id").should(
				"have.text",
				max
			);
			cy.get(".cdk-column-_id > ui-list-table-header > .align-i-center .mat-icon").should(
				"be.visible"
			);
			cy.get(".align-i-center > .ng-star-inserted").click();
			cy.get(".cdk-column-_id > ui-list-table-header > .align-i-center .mat-icon").should(
				"not.exist"
			);
			/* ==== End Cypress Studio ==== */
		});

		it("should get filters from queryParams", () => {
			const { workflows } = db;
			const ids = workflows.map(({ _id }) => _id);
			const max = Math.max(...ids).toString();

			/* ==== Generated with Cypress Studio ==== */
			cy.get(".cdk-column-_id > ui-list-table-header > .align-i-center").click();
			cy.get(".cdk-column-_id > ui-list-table-header > .align-i-center").click();
			cy.get(".mdc-data-table__content > :nth-child(1) > .cdk-column-_id").should(
				"have.text",
				max
			);
			cy.get(".cdk-column-name > ui-list-table-header > .align-i-center > span").click();
			/* ==== End Cypress Studio ==== */

			cy.reload();

			/* ==== Generated with Cypress Studio ==== */
			cy.get(".mdc-data-table__content > :nth-child(1) > .cdk-column-_id").should(
				"have.text",
				max
			);
			cy.get(".cdk-column-_id > ui-list-table-header > .align-i-center .mat-icon").should(
				"be.visible"
			);
			cy.get(
				".cdk-column-name > ui-list-table-header > .align-i-center > .ng-star-inserted > .mat-icon"
			).should("be.visible");
			/* ==== End Cypress Studio ==== */
		});
	});

	it("should open the workflow's page", () => {
		// The selected workflow
		const { _id } = db.workflows[1];

		/* ==== Generated with Cypress Studio ==== */
		cy.get(":nth-child(2) > .cdk-column-_id").should("have.text", _id.toString());
		cy.get(":nth-child(2) > .cdk-column-_id").click();
		/* ==== End Cypress Studio ==== */

		cy.location("pathname").should("eq", `/workflows/${_id}`);
	});
});
