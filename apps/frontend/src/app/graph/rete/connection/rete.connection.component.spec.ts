import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ReteConnectionComponent } from "./rete.connection.component";

describe("ConnectionComponent", () => {
	let component: ReteConnectionComponent;
	let fixture: ComponentFixture<ReteConnectionComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ReteConnectionComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(ReteConnectionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
