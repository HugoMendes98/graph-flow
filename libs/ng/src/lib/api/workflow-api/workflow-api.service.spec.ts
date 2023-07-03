import { TestBed } from "@angular/core/testing";

import { WorkflowApiService } from "./workflow-api.service";
import { ApiClient } from "../api.client";

describe("WorkflowApiService", () => {
	let service: WorkflowApiService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ApiClient],
			providers: [WorkflowApiService]
		});
		service = TestBed.inject(WorkflowApiService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});
