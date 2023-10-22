import { ComponentFixture, TestBed } from "@angular/core/testing";

import { WorkflowUpdateCard } from "./workflow-update.card";

describe("WorkflowLogsCard", () => {
	let component: WorkflowUpdateCard;
	let fixture: ComponentFixture<WorkflowUpdateCard>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [WorkflowUpdateCard]
		}).compileComponents();

		fixture = TestBed.createComponent(WorkflowUpdateCard);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
