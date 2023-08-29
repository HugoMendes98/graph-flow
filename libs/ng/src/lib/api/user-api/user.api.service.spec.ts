import { TestBed } from "@angular/core/testing";

import { UserApiService } from "./user.api.service";
import { ApiClient } from "../api.client";

describe("UserApiService", () => {
	let service: UserApiService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ApiClient],
			providers: [UserApiService]
		});
		service = TestBed.inject(UserApiService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});
