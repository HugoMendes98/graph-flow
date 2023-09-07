import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReteModule } from "rete-angular-plugin/16";
import { Writable } from "type-fest";
import { GraphNode } from "~/lib/common/app/graph/endpoints";
import { BASE_SEED } from "~/lib/common/seeds";
import { ReteNode } from "~/lib/ng/lib/rete";

import { ReteNodeComponent } from "./rete.node.component";

describe("NodeComponent", () => {
	let component: ReteNodeComponent;
	let fixture: ComponentFixture<ReteNodeComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ReteNodeComponent]
		})
			.overrideModule(ReteModule, {})
			.compileComponents();

		fixture = TestBed.createComponent(ReteNodeComponent);
		component = fixture.componentInstance;
		(component as Writable<ReteNodeComponent>).data = new ReteNode({
			...(JSON.parse(JSON.stringify(BASE_SEED.graph.graphNodes[0])) as GraphNode),
			inputs: [],
			outputs: []
		});
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
