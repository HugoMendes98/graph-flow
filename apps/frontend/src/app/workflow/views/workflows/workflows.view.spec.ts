import { ComponentFixture, TestBed } from "@angular/core/testing";

import { WorkflowsView } from "./workflows.view";

describe("WorkflowsView", () => {
	let component: WorkflowsView;
	let fixture: ComponentFixture<WorkflowsView>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [WorkflowsView]
		}).compileComponents();

		fixture = TestBed.createComponent(WorkflowsView);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
