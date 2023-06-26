import { ComponentFixture, TestBed } from "@angular/core/testing";

import { GroupComponent } from "./group.component";

describe("GroupComponent", () => {
	let component: GroupComponent;
	let fixture: ComponentFixture<GroupComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [GroupComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(GroupComponent);
		component = fixture.componentInstance;
		component.group = {
			__creator: null,
			_created_at: new Date(),
			_id: 0,
			_name: "",
			_updated_at: new Date(),
			description: {},
			name: {}
		};
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
