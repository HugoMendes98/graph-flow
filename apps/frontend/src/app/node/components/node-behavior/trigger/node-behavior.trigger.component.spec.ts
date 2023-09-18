import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NodeBehaviorTriggerComponent } from "./node-behavior.trigger.component";

describe("NodeBehaviorTriggerComponent", () => {
	let component: NodeBehaviorTriggerComponent;
	let fixture: ComponentFixture<NodeBehaviorTriggerComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [NodeBehaviorTriggerComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(NodeBehaviorTriggerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
