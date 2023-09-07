// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

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

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace -- same as above
	namespace Cypress {
		interface Chainable {
			authConnectAs: typeof authConnectAs;
			authDisconnect: typeof authDisconnect;
		}
	}
}

Cypress.Commands.add("authConnectAs", authConnectAs);
Cypress.Commands.add("authDisconnect", authDisconnect);
