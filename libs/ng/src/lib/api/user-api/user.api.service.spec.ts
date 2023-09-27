import { TestBed } from "@angular/core/testing";

import { UserApiService } from "./user.api.service";
import { ApiTestingModule } from "../testing";

describe("UserApiService", () => {
	let service: UserApiService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ApiTestingModule]
		});
		service = TestBed.inject(UserApiService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});
