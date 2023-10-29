import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of } from "rxjs";

import { GraphEditorComponent } from "./graph-editor.component";

describe("GraphEditorComponent", () => {
	let component: GraphEditorComponent;
	let fixture: ComponentFixture<GraphEditorComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [GraphEditorComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(GraphEditorComponent);
		component = fixture.componentInstance;
		component.nodes$ = of({ snapshot: { isLoading: false }, state: "init" });
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
