import { DbE2eHelper } from "~/app/backend/e2e/db-e2e/db-e2e.helper";
import { BASE_SEED } from "~/lib/common/seeds";

describe("Auth", () => {
	const dbHelper = DbE2eHelper.getHelper("base");
	const db = dbHelper.db as typeof BASE_SEED;

	const [workflow] = db.workflows;

	const pathLogin = "/auth/login";
	/** a path to a protected content */
	const pathProtected = `/workflows/${workflow._id}?param1=1&param2=2`;

	before(() => dbHelper.refresh());

	beforeEach(() => {
		cy.authDisconnect();
		cy.visit(pathLogin);
	});

	describe("Login", () => {
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
			const [{ email, password }] = db.users;

			/* ==== Generated with Cypress Studio ==== */
			cy.get("#mat-input-0").type(email);
			cy.get("#mat-input-1").type(password);

			cy.get(".mdc-button").click();
			cy.get(".mat-mdc-card-title").should("contain.text", `Hello ${email}!`);
			// /* ==== End Cypress Studio ==== */

			cy.location("pathname").should("eq", "/");
		});
	});

	describe("Auth guard", () => {
		it("should redirect to the login page when accessing protected content and redirect to this page after login", () => {
			const [{ email, password }] = db.users;

			cy.visit(pathProtected);

			cy.location("pathname").should("eq", pathLogin);
			cy.location("search").should("eq", `?redirectUrl=${encodeURIComponent(pathProtected)}`);

			cy.get("#mat-input-0").type(email);
			cy.get("#mat-input-1").type(password);
			cy.get("#mat-input-1").type("{enter}");

			cy.url().should("contains", pathProtected);
		});

		it("should load the protected page when already connected", () => {
			const [{ email, password }] = db.users;

			cy.authConnectAs(email, password);
			cy.visit(pathProtected);
			cy.url().should("contains", pathProtected);
		});
	});

	describe("Auth interceptor", () => {
		it.only("should redirect when a request has a 401 error", () => {
			const [{ email, password }] = db.users;
			cy.authConnectAs(email, password);
			cy.visit(pathProtected);

			const sckInput = () =>
				cy
					.findByText("Make SQL query")
					.parent()
					.children(".input")
					.first()
					.children(".input-socket");

			// This removes the arc
			sckInput().click();

			cy.authDisconnect();

			// This tries to add it back
			sckInput().click();

			// eslint-disable-next-line cypress/no-unnecessary-waiting -- Wait if there is a "redirection loop"
			cy.wait(125);

			cy.location("pathname").should("eq", pathLogin);
			cy.location("search").should("eq", `?redirectUrl=${encodeURIComponent(pathProtected)}`);

			/* ==== Generated with Cypress Studio ==== */
			cy.get(".mat-mdc-simple-snack-bar").should("be.visible");
			/* ==== End Cypress Studio ==== */
		});
	});
});
