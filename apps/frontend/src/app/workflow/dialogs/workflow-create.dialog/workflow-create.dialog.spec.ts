import { ComponentFixture, TestBed } from "@angular/core/testing";

import { WorkflowCreateDialog } from "./workflow-create.dialog";

describe("WorkflowCreateDialogComponent", () => {
	let component: WorkflowCreateDialog;
	let fixture: ComponentFixture<WorkflowCreateDialog>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [WorkflowCreateDialog]
		}).compileComponents();

		fixture = TestBed.createComponent(WorkflowCreateDialog);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
