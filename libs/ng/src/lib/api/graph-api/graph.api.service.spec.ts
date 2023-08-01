import { TestBed } from "@angular/core/testing";

import { GraphApiService } from "./graph.api.service";
import { ApiClient } from "../api.client";

describe("GraphApiService", () => {
	let service: GraphApiService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ApiClient],
			providers: [GraphApiService]
		});
		service = TestBed.inject(GraphApiService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});
