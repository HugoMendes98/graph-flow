import { DbE2eHelper } from "~/app/backend/e2e/db-e2e/db-e2e.helper";
import { NodeKindType } from "~/lib/common/app/node/dtos/kind/node-kind.type";
import { BASE_SEED } from "~/lib/common/seeds";

describe("Nodes list", () => {
	const dbHelper = DbE2eHelper.getHelper("base");
	const db = dbHelper.db as typeof BASE_SEED;

	const nodes = db.graph.nodes.filter(({ kind }) => kind.type === NodeKindType.TEMPLATE);

	before(() => cy.dbRefresh("base"));

	beforeEach(() => {
		const { email, password } = db.users[0];
		cy.authConnectAs(email, password);
	});

	it("should open a node's page", () => {
		cy.visit("/nodes");

		// The selected node
		const { _id } = nodes[1];

		/* ==== Generated with Cypress Studio ==== */
		cy.get(".mdc-data-table__content > :nth-child(3) > .cdk-column-_id").should(
			"have.text",
			_id
		);
		cy.get(".mdc-data-table__content > :nth-child(3) > .cdk-column-_id").click();
		cy.get(
			".mdc-data-table__content > :nth-child(4) .node-edit > .mat-mdc-button-touch-target"
		).click();
		/* ==== End Cypress Studio ==== */

		cy.location("pathname").should("eq", `/nodes/${_id}`);
	});

	describe("Sort", () => {
		beforeEach(() => cy.visit("/nodes"));

		it("should sort columns", () => {
			const ids = nodes.map(({ _id }) => _id);
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
			cy.get(".cdk-column-_id > ui-list-table-header > .align-i-center > span").click();
			cy.get(".mdc-data-table__content > :nth-child(1) > .cdk-column-_id").should(
				"have.text",
				max
			);
			cy.get(".cdk-column-_id > ui-list-table-header > .align-i-center .mat-icon").should(
				"be.visible"
			);
			cy.get(".cdk-column-_id > ui-list-table-header > .align-i-center > span").click();
			cy.get(".cdk-column-_id > ui-list-table-header > .align-i-center .mat-icon").should(
				"not.exist"
			);
			/* ==== End Cypress Studio ==== */
		});

		it("should get filters from queryParams", () => {
			const ids = nodes.map(({ _id }) => _id);
			const max = Math.max(...ids).toString();

			/* ==== Generated with Cypress Studio ==== */
			cy.get(".cdk-column-_id > ui-list-table-header > .align-i-center").click();
			// Makes wait for the query parameters FIXME: why is it needed here?
			cy.location("search").should("contains", `_id=asc`);

			cy.get(".cdk-column-_id > ui-list-table-header > .align-i-center").click();
			// Makes wait for the query parameters FIXME: why is it needed here?
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

	describe("Create a Node", () => {
		beforeEach(() => {
			cy.dbRefresh("base");

			// Visit after dbRefresh to avoid a 500 error
			cy.visit("/nodes");
			cy.get("ng-component.ng-star-inserted > .flex-col > .flex-row > button").click();
		});

		it("should create a new node", () => {
			const newId = Math.max(...db.graph.nodes.map(({ _id }) => _id)) + 1;
			const newName = "My new Node";

			/* ==== Generated with Cypress Studio ==== */
			cy.get(".mat-mdc-dialog-container #mat-input-0").type(newName);
			cy.get(".mat-mdc-dialog-container .mat-mdc-select-placeholder").click();
			cy.get(".mat-mdc-select-panel #mat-option-1").click();
			cy.get(".mat-mdc-dialog-container form button[type=submit]").click();
			/* ==== End Cypress Studio ==== */

			cy.location("pathname").should("eq", `/nodes/${newId}`);

			/* ==== Generated with Cypress Studio ==== */
			cy.get('.mat-toolbar [routerlink="/nodes"]').click();
			cy.get(".cdk-column-_id > ui-list-table-header > .align-i-center > span").click();
			cy.get(".cdk-column-_id > ui-list-table-header > .align-i-center > span").click();
			cy.get(".mdc-data-table__content > :nth-child(1) > .cdk-column-_id").should(
				"have.text",
				newId
			);
			cy.get(".mdc-data-table__content > :nth-child(1) > .cdk-column-name").should(
				"have.text",
				newName
			);
			cy.get(".mdc-data-table__content > :nth-child(1) > .cdk-column-behavior-type").should(
				"have.text",
				"function"
			);
			/* ==== End Cypress Studio ==== */
		});
	});
});
