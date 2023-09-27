import { TestBed } from "@angular/core/testing";

import { GraphApiService } from "./graph.api.service";
import { ApiTestingModule } from "../testing";

describe("GraphApiService", () => {
	let service: GraphApiService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ApiTestingModule]
		});
		service = TestBed.inject(GraphApiService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});
