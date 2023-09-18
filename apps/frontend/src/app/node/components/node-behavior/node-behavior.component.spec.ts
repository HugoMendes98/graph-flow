import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NodeBehaviorComponent } from "./node-behavior.component";

describe("NodeBehaviorComponent", () => {
	let component: NodeBehaviorComponent;
	let fixture: ComponentFixture<NodeBehaviorComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [NodeBehaviorComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(NodeBehaviorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
