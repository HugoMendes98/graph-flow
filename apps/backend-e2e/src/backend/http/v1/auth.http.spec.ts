import { AxiosHeaders, AxiosError, HttpStatusCode } from "axios";
import { parse as cookieParser } from "cookie";
import { Jsonify } from "type-fest";
import { config as configE2e } from "~/app/backend/app/config.e2e";
import { DbE2eHelper } from "~/app/backend/e2e/db-e2e/db-e2e.helper";
import { AuthHttpClient } from "~/app/backend/e2e/http/clients";
import { AuthLoginDto, AuthRefreshDto } from "~/lib/common/app/auth/dtos";
import { authOptions } from "~/lib/common/options";
import { BASE_SEED } from "~/lib/common/seeds";
import { omit } from "~/lib/common/utils/object-fns";

describe("Backend HTTP Auth", () => {
	const client = new AuthHttpClient();

	const dbHelper = DbE2eHelper.getHelper("base");
	const { users } = JSON.parse(JSON.stringify(dbHelper.db)) as Jsonify<typeof BASE_SEED>;

	beforeAll(() => dbHelper.refresh());

	describe("Login", () => {
		it("should return an access token with its expire time", async () => {
			const timeoutMs = configE2e.authentication.timeout * 1000;

			for (const user of users) {
				const now = new Date().getTime();
				const { access_token, expires_at } = await client.login({
					email: user.email,
					password: user.password
				} satisfies AuthLoginDto);

				expect(access_token).toBeString();
				expect(expires_at).toBeGreaterThanOrEqual(now + timeoutMs - 1500);
				expect(expires_at).toBeLessThanOrEqual(now + timeoutMs + 1500);
			}
		});

		it("should return a `Set-Cookie` header when logging with the cookie option", async () => {
			const [{ email, password }] = users;
			const now = new Date().getTime();

			const {
				data: { access_token },
				headers
			} = await client.loginResponse({
				cookie: true,
				email,
				password
			} satisfies AuthLoginDto);

			expect(headers["set-cookie"]).toBeDefined();

			const cookie = cookieParser(headers["set-cookie"]![0]);
			expect(cookie).toHaveProperty(authOptions.cookies.name);
			expect(cookie[authOptions.cookies.name]).toBe(access_token);

			expect(cookie).toHaveProperty("Expires");
			expect(cookie.Expires).toBeDateString();

			const expires_at = new Date(cookie.Expires).getTime();
			const timeoutMs = configE2e.authentication.timeout * 1000;

			expect(expires_at).toBeGreaterThanOrEqual(now + timeoutMs - 1500);
			expect(expires_at).toBeLessThanOrEqual(now + timeoutMs + 1500);
		});

		describe("Validation", () => {
			it("should fail when the email field is not an email", async () => {
				const { status } = await client
					.loginResponse({
						email: "",
						password: "password"
					} satisfies AuthLoginDto)
					.catch(({ response }: AxiosError) => response!);

				expect(status).toBe(HttpStatusCode.BadRequest);
			});

			it("should fail when the email is missing", async () => {
				const { status } = await client
					.loginResponse({ password: "password" } satisfies Omit<AuthLoginDto, "email">)
					.catch(({ response }: AxiosError) => response!);
				expect(status).toBe(HttpStatusCode.BadRequest);
			});

			it("should fail when the password is missing", async () => {
				const { status } = await client
					.loginResponse({ email: "a@b.cd" } satisfies Omit<AuthLoginDto, "password">)
					.catch(({ response }: AxiosError) => response!);
				expect(status).toBe(HttpStatusCode.BadRequest);
			});

			it("should fail when the email is not a string", async () => {
				const { status } = await client
					.loginResponse({
						email: 123 as unknown as string,
						password: "abc"
					} satisfies AuthLoginDto)
					.catch(({ response }: AxiosError) => response!);
				expect(status).toBe(HttpStatusCode.BadRequest);
			});
		});
	});

	describe("Refresh", () => {
		const sleep = () => new Promise(resolve => setTimeout(resolve, 1050));

		it("should fail when no auth (header or cookie) set", async () => {
			const { status } = await client
				.refreshResponse()
				.catch(({ response }: AxiosError) => response!);
			expect(status).toBe(HttpStatusCode.Unauthorized);
		});

		it("should refresh with authentication set in header", async () => {
			const { access_token: token, expires_at: expires_before } = await client.login(
				users[0] satisfies AuthLoginDto
			);

			// So the expires_at time is not the same
			await sleep();

			const { access_token, expires_at } = await client.refresh(undefined, {
				headers: new AxiosHeaders().setAuthorization(`Bearer ${token}`)
			});

			expect(access_token).not.toBe(token);
			expect(expires_at).toBeGreaterThan(expires_before);
		});

		it("should refresh with authentication set in cookie", async () => {
			const { access_token: token, expires_at: expires_before } = await client.login({
				...users[0],
				cookie: true
			} satisfies AuthLoginDto);

			// So the expires_at time is not the same
			await sleep();

			const { access_token, expires_at } = await client.refresh(
				{ cookie: true } satisfies AuthRefreshDto,
				{ headers: { Cookie: `${authOptions.cookies.name}=${token}` } }
			);

			expect(access_token).not.toBe(token);
			expect(expires_at).toBeGreaterThan(expires_before);
		});
	});

	describe("Logout", () => {
		it("should logout (delete HTTPOnly for cookie)", async () => {
			const { access_token: token } = await client.login({
				...users[0],
				cookie: true
			} satisfies AuthLoginDto);
			await client.getProfile({
				headers: { Cookie: `${authOptions.cookies.name}=${token}` }
			});

			const { headers } = await client.logoutResponse({
				headers: { Cookie: `${authOptions.cookies.name}=${token}` }
			});

			expect(headers["set-cookie"]).toBeDefined();

			const cookie = cookieParser(headers["set-cookie"]![0]);
			expect(cookie).toHaveProperty(authOptions.cookies.name);
			expect(cookie[authOptions.cookies.name]).toBeEmpty();
		});
	});

	describe("GetProfile", () => {
		it("should get profile of connected user", async () => {
			for (const user of users) {
				const { access_token } = await client.login(user satisfies AuthLoginDto);

				const profile = await client.getProfile({
					headers: new AxiosHeaders().setAuthorization(`Bearer ${access_token}`)
				});
				expect(profile).toStrictEqual(omit(user, ["password"]));
			}
		});

		it("should fail when getting the profile when not connected", async () => {
			const { status } = await client
				.getProfileResponse()
				.catch(({ response }: AxiosError) => response!);
			expect(status).toBe(HttpStatusCode.Unauthorized);
		});
	});
});
