import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { NodesView } from "./nodes.view";

describe("NodesView", () => {
	let component: NodesView;
	let fixture: ComponentFixture<NodesView>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [RouterTestingModule, NodesView]
		}).compileComponents();

		fixture = TestBed.createComponent(NodesView);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
