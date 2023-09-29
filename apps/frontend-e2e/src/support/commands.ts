// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

import { DbE2eHelper } from "~/app/backend/e2e/db-e2e/db-e2e.helper";
import { DbTestSample } from "~/app/backend/test/db-test";
import { AuthLoginDto } from "~/lib/common/app/auth/dtos";
import { AUTH_ENDPOINT_PREFIX, AuthEndpoints } from "~/lib/common/app/auth/endpoints";

// TODO: a way to get this from configuration?
const e2eApi = "http://127.0.0.1:32300/e2e/api";

const authConnectAs = (email: string, password: string) =>
	cy.request("post", `${e2eApi}${AUTH_ENDPOINT_PREFIX}/${AuthEndpoints.LOGIN}`, {
		cookie: true,
		email,
		password
	} satisfies AuthLoginDto);

const authDisconnect = () =>
	cy
		.request("post", `${e2eApi}${AUTH_ENDPOINT_PREFIX}/${AuthEndpoints.LOGOUT}`)
		.then(() => cy.clearCookies());

const dbRefresh = (sample: DbTestSample) => cy.wrap(DbE2eHelper.getHelper(sample).refresh());

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace -- same as above
	namespace Cypress {
		interface Chainable {
			authConnectAs: typeof authConnectAs;
			authDisconnect: typeof authDisconnect;
			dbRefresh: typeof dbRefresh;
		}
	}
}

Cypress.Commands.add("authConnectAs", authConnectAs);
Cypress.Commands.add("authDisconnect", authDisconnect);
Cypress.Commands.add("dbRefresh", dbRefresh);
