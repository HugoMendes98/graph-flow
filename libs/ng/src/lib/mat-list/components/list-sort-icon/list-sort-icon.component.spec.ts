import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ListSortIconComponent } from "./list-sort-icon.component";

describe("ListSortIconComponent", () => {
	let component: ListSortIconComponent;
	let fixture: ComponentFixture<ListSortIconComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ListSortIconComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(ListSortIconComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
