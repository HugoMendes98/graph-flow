import { UserEntity } from "../user/user.entity";

/**
 * Payload inside a JWT
 */
export interface JWTPayload extends Pick<UserEntity, "_id" | "email"> {
	/**
	 * How the login has been made (only local here, but could be Google, FB, Microsoft, ...)
	 */
	method: "local";
}
