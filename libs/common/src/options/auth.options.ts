/**
 * Some options for authentication.
 *
 * Only values that can be shared to backend and frontend.
 * All secrets or keys are only available to the backend.
 */
export const authOptions = {
	cookies: {
		name: "auth_token"
	}
} as const;
