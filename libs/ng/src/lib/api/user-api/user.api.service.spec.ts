import { TestBed } from "@angular/core/testing";

import { UserApiService } from "./user.api.service";
import { ApiModule } from "../api.module";

describe("UserApiService", () => {
	let service: UserApiService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ApiModule.forRoot({ client: { url: "" } })]
		});
		service = TestBed.inject(UserApiService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});
