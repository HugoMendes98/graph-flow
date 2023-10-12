import { UnauthorizedException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { BASE_SEED } from "~/lib/common/seeds";

import { AuthModule } from "./auth.module";
import { AuthService } from "./auth.service";
import { DbTestHelper } from "../../../test/db-test";
import { getConfiguration } from "../../configuration";
import { OrmModule } from "../../orm/orm.module";
import { UserService } from "../user/user.service";

describe("AuthService", () => {
	let db: typeof BASE_SEED;
	let dbTest: DbTestHelper;
	let service: AuthService;
	let userService: UserService;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [AuthModule, OrmModule]
		}).compile();

		dbTest = new DbTestHelper(module);
		service = module.get(AuthService);
		userService = module.get(UserService);

		db = dbTest.db as typeof BASE_SEED;
		await dbTest.refresh();
	});

	afterAll(() => dbTest.close());

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("Hash & compare", () => {
		const password = "aPassword$-.1234_";

		it("should hash and compare correctly", async () => {
			const hash = await AuthService.hash(password);
			expect(hash).not.toBe(password);

			const same = await AuthService.compare(password, hash);
			expect(same).toBeTrue();
		});

		it("should return false when comparing hashes", async () => {
			const hash = await AuthService.hash(password);
			expect(hash).not.toBe(password);

			for (const clear of ["a password", "12345678", "--__"]) {
				expect(clear).not.toBe(password);

				const same = await AuthService.compare(clear, hash);
				expect(same).toBeFalse();
			}
		});
	});

	it("should return a login success", async () => {
		const {
			authentication: { timeout }
		} = getConfiguration();
		const timeoutMs = timeout * 1000;

		const user = await userService.findById(db.users[0]._id);

		const now = new Date().getTime();
		const { access_token, expires_at } = await service.login(user);

		expect(access_token).toBeString();
		expect(expires_at).toBeGreaterThanOrEqual(now + timeoutMs - 1500);
		expect(expires_at).toBeLessThanOrEqual(now + timeoutMs + 1500);
	});

	describe("validateCredentials", () => {
		it("should be ok with valid email/password", async () => {
			const [{ _id, email, password }] = db.users;

			const user = await service.validateCredentials(email, password);
			expect(user._id).toBe(_id);
		});

		it("should be not ok with invalid password", async () => {
			const [{ email, password }] = db.users;

			await expect(() =>
				service.validateCredentials(email, `${password}${password}`)
			).rejects.toThrow(UnauthorizedException);
		});

		it("should be not ok with unknown email", async () => {
			const [{ email, password }] = db.users;

			await expect(() =>
				service.validateCredentials(`${email}${email}`, password)
			).rejects.toThrow(UnauthorizedException);
		});
	});

	describe("validateJWT", () => {
		it("should be ok", async () => {
			const [{ _id, email }] = db.users;

			const user = await service.validateJWT({ _id, email, method: "local" });
			expect(user._id).toBe(_id);
			expect(user.email).toBe(email);
		});

		it("should be not ok with unknown id", async () => {
			const { users } = db;
			const [{ email }] = users;
			const maxId = Math.max(...users.map(({ _id }) => _id)) + 1;

			await expect(() =>
				service.validateJWT({ _id: maxId, email, method: "local" })
			).rejects.toThrow(UnauthorizedException);
		});

		it("should be not ok with invalid email", async () => {
			const [{ _id, email }] = db.users;
			await expect(() =>
				service.validateJWT({ _id, email: `${email}${email}`, method: "local" })
			).rejects.toThrow(UnauthorizedException);
		});
	});
});
