import { HttpErrorResponse } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { HttpErrorCard } from "./http-error.card";

describe("NetErrorCardComponent", () => {
	let component: HttpErrorCard;
	let fixture: ComponentFixture<HttpErrorCard>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HttpErrorCard]
		}).compileComponents();

		fixture = TestBed.createComponent(HttpErrorCard);
		component = fixture.componentInstance;
		component.error = new HttpErrorResponse({ status: 400 });
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
