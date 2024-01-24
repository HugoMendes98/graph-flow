import { DbE2eHelper } from "~/app/backend/e2e/db-e2e/db-e2e.helper";
import { UserUpdateDto } from "~/lib/common/app/user/dtos";
import { BASE_SEED } from "~/lib/common/seeds";

describe("Profile", () => {
	const dbHelper = DbE2eHelper.getHelper("base");
	const db = dbHelper.db as typeof BASE_SEED;

	const [user] = db.users;

	before(() => cy.dbRefresh("base"));

	it("should not show the icon when user is not connected", () => {
		cy.visit("/");

		/* ==== Generated with Cypress Studio ==== */
		cy.get(".mat-toolbar .mat-mdc-button-touch-target").should("not.exist");
		/* ==== End Cypress Studio ==== */
	});

	it("should logout user", () => {
		cy.authConnectAs(user.email, user.password);
		cy.visit("/");

		/* ==== Generated with Cypress Studio ==== */
		cy.get(".mat-toolbar .mat-mdc-button-touch-target").click();
		cy.get("[role=menu] > div > button:nth-of-type(2)").click();
		/* ==== End Cypress Studio ==== */

		cy.reload();
		cy.get(".mat-toolbar .mat-mdc-button-touch-target").should("not.exist");
	});

	describe("When connected", () => {
		beforeEach(() => {
			cy.dbRefresh("base");
			cy.authConnectAs(user.email, user.password);
			cy.visit("/");

			/* ==== Generated with Cypress Studio ==== */
			cy.get(".mat-toolbar .mat-mdc-button-touch-target").click();
			cy.get("[role=menu] > div > button:nth-of-type(1)").click();
			/* ==== End Cypress Studio ==== */
		});

		it("should update the first/last name of the connected user (and propagate info)", () => {
			const toUpdate = {
				firstname: "First",
				lastname: "Last"
			} as const satisfies UserUpdateDto;

			/* ==== Generated with Cypress Studio ==== */
			cy.get("#mat-input-1").clear();
			cy.get("#mat-input-1").type(toUpdate.firstname);
			cy.get("#mat-input-2").clear();
			cy.get("#mat-input-2").type(`${toUpdate.lastname}{enter}`);
			cy.get(
				".mat-mdc-dialog-actions > .mdc-button > .mdc-button__label"
			).click();
			cy.get(".mat-toolbar .mat-mdc-button-touch-target").click();
			cy.get(
				".mat-mdc-menu-item > span.mat-mdc-menu-item-text:nth-child(1)"
			).should("have.text", `${toUpdate.firstname} ${toUpdate.lastname}`);
			/* ==== End Cypress Studio ==== */
		});
	});
});
