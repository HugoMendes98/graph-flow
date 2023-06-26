import { DbE2eHelper } from "~/app/backend/e2e/db-e2e/db-e2e.helper";

describe("frontend", () => {
	const dbHelper = DbE2eHelper.getHelper("base");
	const { groups } = dbHelper.db;

	before(async () => dbHelper.refresh());

	beforeEach(() => cy.visit("/"));

	it("should read 1 event", () => {
		/* ==== Generated with Cypress Studio ==== */
		cy.get("a").click();
		cy.get(".mat-mdc-button-touch-target").click();
		cy.get("p > span").should("have.text", groups.length.toString());
		cy.get(":nth-child(2) > app-group > #root > h3").should("have.text", groups[0]._name);
		cy.get(":nth-child(3) > app-group > #root > h3").should("have.text", groups[1]._name);
		cy.get(":nth-child(4) > app-group > #root > h3").should("have.text", groups[2]._name);
		/* ==== End Cypress Studio ==== */
	});
});
