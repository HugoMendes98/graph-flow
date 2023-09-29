import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

import { WorkflowCreateDialog, WorkflowCreateDialogData } from "./workflow-create.dialog";

describe("WorkflowCreateDialogComponent", () => {
	let component: WorkflowCreateDialog;
	let fixture: ComponentFixture<WorkflowCreateDialog>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [WorkflowCreateDialog]
		})
			.overrideProvider(MAT_DIALOG_DATA, { useValue: {} satisfies WorkflowCreateDialogData })
			.overrideProvider(MatDialogRef, { useValue: {} })
			.compileComponents();

		fixture = TestBed.createComponent(WorkflowCreateDialog);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
