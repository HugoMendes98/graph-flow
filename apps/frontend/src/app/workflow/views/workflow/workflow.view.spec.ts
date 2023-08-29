import { ComponentFixture, TestBed } from "@angular/core/testing";

import { WorkflowView } from "./workflow.view";

describe("WorkflowView", () => {
	let component: WorkflowView;
	let fixture: ComponentFixture<WorkflowView>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [WorkflowView]
		}).compileComponents();

		fixture = TestBed.createComponent(WorkflowView);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
