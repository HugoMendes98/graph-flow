import { TestBed } from "@angular/core/testing";

import { WorkflowApiService } from "./workflow.api.service";
import { ApiModule } from "../api.module";

describe("WorkflowApiService", () => {
	let service: WorkflowApiService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ApiModule.forRoot({ client: { url: "" } })]
		});
		service = TestBed.inject(WorkflowApiService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});
