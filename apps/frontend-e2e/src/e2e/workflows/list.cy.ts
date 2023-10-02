import { DbE2eHelper } from "~/app/backend/e2e/db-e2e/db-e2e.helper";
import { BASE_SEED } from "~/lib/common/seeds";

describe("Workflows list", () => {
	const dbHelper = DbE2eHelper.getHelper("base");
	const db = dbHelper.db as typeof BASE_SEED;

	before(() => cy.dbRefresh("base"));

	beforeEach(() => {
		const { email, password } = db.users[0];
		cy.authConnectAs(email, password);
	});

	describe("Sort", () => {
		beforeEach(() => cy.visit("/workflows"));

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
			// Makes wait for the query parameters
			cy.location("search").should("contains", `_id=desc`);
			cy.get(".mdc-data-table__content > :nth-child(1) > .cdk-column-_id").should(
				"have.text",
				max
			);
			cy.get(".cdk-column-name > ui-list-table-header > .align-i-center").click();
			/* ==== End Cypress Studio ==== */

			// Makes wait for the query parameters
			cy.location("search").should("contains", `name=asc`);
			cy.reload();

			/* ==== Generated with Cypress Studio ==== */
			cy.get(".mdc-data-table__content > :nth-child(1) > .cdk-column-_id").should(
				"have.text",
				max
			);
			cy.get(".cdk-column-_id > ui-list-table-header > .align-i-center .mat-icon").should(
				"be.visible"
			);
			cy.get(".cdk-column-name > ui-list-table-header > .align-i-center .mat-icon").should(
				"be.visible"
			);
			/* ==== End Cypress Studio ==== */
		});
	});

	it("should open a workflow's page", () => {
		cy.visit("/workflows");

		// The selected workflow
		const { _id } = db.workflows[1];

		/* ==== Generated with Cypress Studio ==== */
		cy.get(":nth-child(2) > .cdk-column-_id").should("have.text", _id.toString());
		cy.get(":nth-child(2) > .cdk-column-_id").click();
		/* ==== End Cypress Studio ==== */

		cy.location("pathname").should("eq", `/workflows/${_id}`);
	});

	describe("Create a Workflow", () => {
		beforeEach(() => {
			cy.dbRefresh("base");

			// Visit after dbRefresh to avoid a 500 error
			cy.visit("/workflows");
			cy.get("ng-component.ng-star-inserted > .flex-col > .flex-row > button").click();
		});

		it("should create a new workflow", () => {
			const { workflows } = db;
			const newId = Math.max(...workflows.map(({ _id }) => _id)) + 1;

			const newName = "My new workflow";

			/* ==== Generated with Cypress Studio ==== */
			cy.get(".mat-mdc-dialog-container #mat-input-0").type(newName);
			cy.get(".mat-mdc-dialog-container form button[type=submit]").click();
			/* ==== End Cypress Studio ==== */

			cy.location("pathname").should("eq", `/workflows/${newId}`);

			/* ==== Generated with Cypress Studio ==== */
			cy.get('.mat-toolbar [routerlink="/workflows"]').click();
			cy.get(".cdk-column-_id > ui-list-table-header > .align-i-center > span").click();
			cy.get(".cdk-column-_id > ui-list-table-header > .align-i-center > span").click();
			cy.get('[ng-reflect-router-link="/workflows/4"] > .cdk-column-name').should(
				"have.text",
				newName
			);
			/* ==== End Cypress Studio ==== */
		});

		it("should indicate that a name is already taken", () => {
			const [workflow] = db.workflows;

			cy.get(".mat-mdc-dialog-container #mat-input-0").type(workflow.name);
			/* ==== Generated with Cypress Studio ==== */
			cy.get(".mat-mdc-dialog-container .gap-1 > .mat-warn").should("contain.text", "close");
			/* ==== End Cypress Studio ==== */
		});
	});
});
