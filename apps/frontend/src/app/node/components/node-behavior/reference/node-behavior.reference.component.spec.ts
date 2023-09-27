import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NodeBehaviorReferenceComponent } from "./node-behavior.reference.component";

describe("NodeBehaviorReferenceComponent", () => {
	let component: NodeBehaviorReferenceComponent;
	let fixture: ComponentFixture<NodeBehaviorReferenceComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [NodeBehaviorReferenceComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(NodeBehaviorReferenceComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
