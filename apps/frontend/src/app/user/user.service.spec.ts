import { TestBed } from "@angular/core/testing";
import { BASE_SEED } from "~/lib/common/seeds";

import { UserModule } from "./user.module";
import { UserService } from "./user.service";

describe("UserService", () => {
	let service: UserService;

	beforeEach(() => {
		TestBed.configureTestingModule({ imports: [UserModule] });
		service = TestBed.inject(UserService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});

	it("should display an user", () => {
		const {
			users: [user1, user2]
		} = BASE_SEED;

		expect(service.displayName(user1)).toBe(user1.email);
		expect(service.displayName(user2)).toBe(
			`${user2.firstname} ${user2.lastname}`
		);

		expect(service.displayName({ ...user2, lastname: null })).toBe(
			user2.firstname
		);
		expect(service.displayName({ ...user2, firstname: null })).toBe(
			user2.lastname
		);
	});
});
