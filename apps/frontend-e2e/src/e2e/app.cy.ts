import { DbE2eHelper } from "~/app/backend/e2e/db-e2e/db-e2e.helper";

describe("frontend", () => {
	const dbHelper = DbE2eHelper.getHelper("base");
	// const { users } = dbHelper.db;

	before(async () => dbHelper.refresh());

	beforeEach(() => cy.visit("/"));
});
