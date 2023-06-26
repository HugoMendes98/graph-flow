import { TestBed } from "@angular/core/testing";

import { GroupApiService } from "./group-api.service";
import { ApiClient } from "../api.client";

describe("GroupApiService", () => {
	let service: GroupApiService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ApiClient],
			providers: [GroupApiService]
		});
		service = TestBed.inject(GroupApiService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});
