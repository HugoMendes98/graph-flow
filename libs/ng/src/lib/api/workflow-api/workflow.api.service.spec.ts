import { TestBed } from "@angular/core/testing";

import { WorkflowApiService } from "./workflow.api.service";
import { ApiTestingModule } from "../testing";

describe("WorkflowApiService", () => {
	let service: WorkflowApiService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ApiTestingModule]
		});
		service = TestBed.inject(WorkflowApiService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});
