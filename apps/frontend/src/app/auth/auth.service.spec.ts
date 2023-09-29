import { TestBed } from "@angular/core/testing";

import { AuthModule } from "./auth.module";
import { AuthService } from "./auth.service";

describe("AuthService", () => {
	let service: AuthService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [AuthModule]
		});
		service = TestBed.inject(AuthService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});
