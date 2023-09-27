import { TestBed } from "@angular/core/testing";

import { AuthApiService } from "./auth-api.service";
import { ApiTestingModule } from "../testing";

describe("AuthApiService", () => {
	let service: AuthApiService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ApiTestingModule]
		});
		service = TestBed.inject(AuthApiService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});
