import { TestBed } from "@angular/core/testing";

import { NodeApiService } from "./node.api.service";
import { ApiTestingModule } from "../testing";

describe("NodeApiService", () => {
	let service: NodeApiService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ApiTestingModule]
		});
		service = TestBed.inject(NodeApiService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});
