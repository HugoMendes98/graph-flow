import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { NodeKindType } from "~/lib/common/app/node/dtos/kind/node-kind.type";

import { NodeCreateDialog, NodeCreateDialogData } from "./node-create.dialog";

describe("NodeCreateDialog", () => {
	let component: NodeCreateDialog;
	let fixture: ComponentFixture<NodeCreateDialog>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [NodeCreateDialog]
		})
			.overrideProvider(MAT_DIALOG_DATA, {
				useValue: {
					initialData: { kind: { active: true, type: NodeKindType.TEMPLATE } }
				} satisfies NodeCreateDialogData
			})
			.overrideProvider(MatDialogRef, { useValue: {} })
			.compileComponents();

		fixture = TestBed.createComponent(NodeCreateDialog);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
