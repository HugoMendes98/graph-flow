import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { WorkflowView } from "./workflow.view";

describe("WorkflowView", () => {
	let component: WorkflowView;
	let fixture: ComponentFixture<WorkflowView>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [RouterTestingModule, WorkflowView]
		}).compileComponents();

		fixture = TestBed.createComponent(WorkflowView);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
