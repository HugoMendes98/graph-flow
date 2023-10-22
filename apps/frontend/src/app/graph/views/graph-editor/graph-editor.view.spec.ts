import { ComponentFixture, TestBed } from "@angular/core/testing";

import { GraphEditorView } from "./graph-editor.view";

describe("GraphEditorView", () => {
	let component: GraphEditorView;
	let fixture: ComponentFixture<GraphEditorView>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [GraphEditorView]
		}).compileComponents();

		fixture = TestBed.createComponent(GraphEditorView);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
