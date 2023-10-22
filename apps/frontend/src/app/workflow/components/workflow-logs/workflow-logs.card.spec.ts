import { ComponentFixture, TestBed } from "@angular/core/testing";

import { WorkflowLogsCard } from "./workflow-logs.card";

describe("WorkflowLogsCard", () => {
	let component: WorkflowLogsCard;
	let fixture: ComponentFixture<WorkflowLogsCard>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [WorkflowLogsCard]
		}).compileComponents();

		fixture = TestBed.createComponent(WorkflowLogsCard);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
