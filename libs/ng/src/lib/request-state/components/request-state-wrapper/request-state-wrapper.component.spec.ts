import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RequestStateWrapperComponent } from "./request-state-wrapper.component";

describe("RequestStateWrapperComponent", () => {
	let component: RequestStateWrapperComponent;
	let fixture: ComponentFixture<RequestStateWrapperComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [RequestStateWrapperComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(
			RequestStateWrapperComponent
		) as never;
		component = fixture.componentInstance;
		component.requestState = { state: "init" };
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
