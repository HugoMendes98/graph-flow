import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BASE_SEED } from "~/lib/common/seeds";
import { jsonify } from "~/lib/common/utils/jsonify";

import { GraphNodePreviewComponent } from "./graph-node-preview.component";

describe("NodePreviewComponent", () => {
	let component: GraphNodePreviewComponent;
	let fixture: ComponentFixture<GraphNodePreviewComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [GraphNodePreviewComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(GraphNodePreviewComponent);
		component = fixture.componentInstance;
		component.node = jsonify(BASE_SEED.graph.nodes[0]);
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
