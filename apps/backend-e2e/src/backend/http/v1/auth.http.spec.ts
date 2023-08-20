import { AxiosError, HttpStatusCode } from "axios";
import { parse as cookieParser } from "cookie";
import { Jsonify } from "type-fest";
import { DbE2eHelper } from "~/app/backend/e2e/db-e2e/db-e2e.helper";
import { AuthHttpClient } from "~/app/backend/e2e/http/clients";
import { configTest } from "~/app/backend/test/support/config.test";
import { AuthLoginDto } from "~/lib/common/app/auth/dtos";
import { authOptions } from "~/lib/common/options";
import { BASE_SEED } from "~/lib/common/seeds";

describe("Backend HTTP Auth", () => {
	const client = new AuthHttpClient();

	const dbHelper = DbE2eHelper.getHelper("base");
	const { users } = JSON.parse(JSON.stringify(dbHelper.db)) as Jsonify<typeof BASE_SEED>;

	beforeAll(() => dbHelper.refresh());

	describe("Login", () => {
		it("should return an access token with its expire time", async () => {
			const timeoutMs = configTest.authentication.timeout * 1000;

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
			const timeoutMs = configTest.authentication.timeout * 1000;

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
});
