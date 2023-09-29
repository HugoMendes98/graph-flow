import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NodeBehaviorVariableComponent } from "./node-behavior.variable.component";

describe("NodeBehaviorVariableComponent", () => {
	let component: NodeBehaviorVariableComponent;
	let fixture: ComponentFixture<NodeBehaviorVariableComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [NodeBehaviorVariableComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(NodeBehaviorVariableComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
