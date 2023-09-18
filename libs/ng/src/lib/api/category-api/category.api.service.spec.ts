import { TestBed } from "@angular/core/testing";

import { CategoryApiService } from "./category.api.service";
import { ApiTestingModule } from "../testing";

describe("CategoryApiService", () => {
	let service: CategoryApiService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ApiTestingModule]
		});
		service = TestBed.inject(CategoryApiService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});
