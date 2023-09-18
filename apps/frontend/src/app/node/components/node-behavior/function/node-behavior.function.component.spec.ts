import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NodeBehaviorFunctionComponent } from "./node-behavior.function.component";

describe("NodeBehaviorFunctionComponent", () => {
	let component: NodeBehaviorFunctionComponent;
	let fixture: ComponentFixture<NodeBehaviorFunctionComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [NodeBehaviorFunctionComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(NodeBehaviorFunctionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
