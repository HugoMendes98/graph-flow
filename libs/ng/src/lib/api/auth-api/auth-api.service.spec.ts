import { TestBed } from "@angular/core/testing";

import { AuthApiService } from "./auth-api.service";
import { ApiClient } from "../api.client";

describe("AuthApiService", () => {
	let service: AuthApiService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ApiClient],
			providers: [AuthApiService]
		});
		service = TestBed.inject(AuthApiService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});
