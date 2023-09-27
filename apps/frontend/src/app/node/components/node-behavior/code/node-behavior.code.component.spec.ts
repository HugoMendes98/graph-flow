import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NodeBehaviorCodeComponent } from "./node-behavior.code.component";

describe("NodeBehaviorCodeComponent", () => {
	let component: NodeBehaviorCodeComponent;
	let fixture: ComponentFixture<NodeBehaviorCodeComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [NodeBehaviorCodeComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(NodeBehaviorCodeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
