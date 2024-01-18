import { ComponentFixture, TestBed } from "@angular/core/testing";
import { OrderValue } from "~/lib/common/endpoints";

import { ListTableHeaderComponent } from "./list-table-header.component";
import { ListSortOrderValueDefault } from "../../list-sort.columns";

describe("ListTableHeaderComponent", () => {
	describe("Static function", () => {
		it("should get the next default direction", () => {
			const nextDirection =
				ListTableHeaderComponent.DEFAULT_NEXT_DIRECTION();

			expect(nextDirection(false)).toBe(
				"asc" satisfies ListSortOrderValueDefault
			);
			expect(nextDirection("asc")).toBe(
				"desc" satisfies ListSortOrderValueDefault
			);
			expect(nextDirection("desc")).toBe(false);
		});

		it("should get the next default direction (reversed)", () => {
			const nextDirection =
				ListTableHeaderComponent.DEFAULT_NEXT_DIRECTION(true);

			expect(nextDirection(false)).toBe(
				"desc" satisfies ListSortOrderValueDefault
			);
			expect(nextDirection("desc")).toBe(
				"asc" satisfies ListSortOrderValueDefault
			);
			expect(nextDirection("asc")).toBe(false);
		});
	});

	type Component = ListTableHeaderComponent<1 | 2, OrderValue>;

	let component: Component;
	let fixture: ComponentFixture<Component>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ListTableHeaderComponent]
		}).compileComponents();

		fixture = TestBed.createComponent<Component>(ListTableHeaderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
