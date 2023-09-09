import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReteModule } from "rete-angular-plugin/16";
import { Writable } from "type-fest";
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

		const componentW = component as Writable<ReteNodeComponent>;
		componentW.data = new ReteNode(
			JSON.parse(JSON.stringify(BASE_SEED.graph.nodes[0])) as never
		);
		componentW.emit = () => void 0;

		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
