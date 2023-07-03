import { TestBed } from "@angular/core/testing";

import { CategoryApiService } from "./category-api.service";
import { ApiClient } from "../api.client";

describe("CategoryApiService", () => {
	let service: CategoryApiService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ApiClient],
			providers: [CategoryApiService]
		});
		service = TestBed.inject(CategoryApiService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});
