import { DbE2eHelper } from "~/app/backend/e2e/db-e2e/db-e2e.helper";

describe("office", () => {
	const dbHelper = DbE2eHelper.getHelper("base");

	before(() => dbHelper.refresh());

	beforeEach(() => cy.visit("/"));
});
