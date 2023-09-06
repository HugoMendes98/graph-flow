import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ReteSocketComponent } from "./rete.socket.component";

describe("SocketComponent", () => {
	let component: ReteSocketComponent;
	let fixture: ComponentFixture<ReteSocketComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ReteSocketComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(ReteSocketComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
