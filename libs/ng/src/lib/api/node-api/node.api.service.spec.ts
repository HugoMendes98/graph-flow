import { TestBed } from "@angular/core/testing";

import { NodeApiService } from "./node.api.service";
import { ApiModule } from "../api.module";

describe("NodeApiService", () => {
	let service: NodeApiService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ApiModule.forRoot({ client: { url: "" } })]
		});
		service = TestBed.inject(NodeApiService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});
