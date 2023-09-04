import { TestBed } from "@angular/core/testing";

import { CategoryApiService } from "./category.api.service";
import { ApiModule } from "../api.module";

describe("CategoryApiService", () => {
	let service: CategoryApiService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ApiModule.forRoot({ client: { url: "" } })]
		});
		service = TestBed.inject(CategoryApiService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});
