import { DbE2eHelper } from "~/app/backend/e2e/db-e2e/db-e2e.helper";
import { BASE_SEED } from "~/lib/common/seeds";

describe("Auth login", () => {
	const dbHelper = DbE2eHelper.getHelper("base");
	const db = dbHelper.db as typeof BASE_SEED;

	before(() => dbHelper.refresh());

	beforeEach(() => {
		cy.clearCookies();
		cy.visit("/auth/login");
	});

	/* ==== Test Created with Cypress Studio ==== */
	it("should fail with unknown user", () => {
		/* ==== Generated with Cypress Studio ==== */
		cy.get("#mat-input-0").type("not@existing.user");
		cy.get("#mat-input-1").type("password");
		cy.get(".mdc-button").click();
		cy.get("#mat-mdc-error-2 > span").should("be.visible");
		/* ==== End Cypress Studio ==== */
	});

	/* ==== Test Created with Cypress Studio ==== */
	it("should fail with wrong password", () => {
		/* ==== Generated with Cypress Studio ==== */
		const [{ email, password }] = db.users;

		/* ==== Generated with Cypress Studio ==== */
		cy.get("#mat-input-0").type(email);
		cy.get("#mat-input-1").type(`${password}abc`);
		cy.get(".mdc-button").click();
		cy.get("#mat-mdc-error-2 > span").should("be.visible");
		/* ==== End Cypress Studio ==== */
	});

	/* ==== Test Created with Cypress Studio ==== */
	it("should login and redirect to default", () => {
		/* ==== Generated with Cypress Studio ==== */
		const [{ email, password }] = db.users;

		cy.get("#mat-input-0").type(email);
		cy.get("#mat-input-1").type(password);

		cy.get(".mdc-button").click();
		cy.get(".mat-mdc-card-title").should("contain.text", `Hello ${email}!`);
		// /* ==== End Cypress Studio ==== */

		// eslint-disable-next-line cypress/no-unnecessary-waiting -- Wait for redirection
		cy.wait(1000);
		cy.location("pathname").should("eq", "/");
	});
});
