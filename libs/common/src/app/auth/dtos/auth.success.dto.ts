/**
 * Response for a login success
 */
export class AuthSuccessDto {
	// As a class for swagger

	/**
	 * The access token for bearer auth
	 */
	public readonly access_token!: string;
	/**
	 * The timestamp (ms) when the token expires
	 */
	public readonly expires_at!: number;
	/**
	 * Time in ms before the expiration of the token.
	 * Use `expires_at` - `expires_in` to get the date of the token
	 */
	public readonly expires_in!: number;
}
