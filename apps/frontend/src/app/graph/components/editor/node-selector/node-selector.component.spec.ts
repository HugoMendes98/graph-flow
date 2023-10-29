import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of } from "rxjs";

import { NodeSelectorComponent } from "./node-selector.component";

describe("NodeSelectorComponent", () => {
	let component: NodeSelectorComponent;
	let fixture: ComponentFixture<NodeSelectorComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [NodeSelectorComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(NodeSelectorComponent);
		component = fixture.componentInstance;
		component.nodes$ = of({ snapshot: { isLoading: false }, state: "init" });
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
