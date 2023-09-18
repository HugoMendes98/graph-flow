import { TestBed } from "@angular/core/testing";

import { WorkflowApiService } from "./workflow.api.service";

describe("WorkflowApiService", () => {
	let service: WorkflowApiService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(WorkflowApiService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});
