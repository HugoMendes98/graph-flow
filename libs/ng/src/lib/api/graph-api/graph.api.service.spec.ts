import { TestBed } from "@angular/core/testing";

import { GraphApiService } from "./graph.api.service";
import { ApiModule } from "../api.module";

describe("GraphApiService", () => {
	let service: GraphApiService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ApiModule.forRoot({ client: { url: "" } })]
		});
		service = TestBed.inject(GraphApiService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});
