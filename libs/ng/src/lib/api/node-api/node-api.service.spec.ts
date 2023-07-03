import { TestBed } from "@angular/core/testing";

import { NodeApiService } from "./node-api.service";
import { ApiClient } from "../api.client";

describe("NodeApiService", () => {
	let service: NodeApiService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ApiClient],
			providers: [NodeApiService]
		});
		service = TestBed.inject(NodeApiService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});
