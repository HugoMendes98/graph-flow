import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ApiModule } from "~/app/ng/lib/api";

import { GroupsView } from "./groups.view";
import { ComponentsModule } from "../../components/components.module";

describe("GroupsView", () => {
	let component: GroupsView;
	let fixture: ComponentFixture<GroupsView>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [GroupsView],
			imports: [ApiModule, ComponentsModule]
		}).compileComponents();

		fixture = TestBed.createComponent(GroupsView);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
