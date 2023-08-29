import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ReteNodeComponent } from "./rete.node.component";

describe("NodeComponent", () => {
	let component: ReteNodeComponent;
	let fixture: ComponentFixture<ReteNodeComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ReteNodeComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(ReteNodeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
