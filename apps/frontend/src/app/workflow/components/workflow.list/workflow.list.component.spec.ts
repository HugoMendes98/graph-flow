import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TranslateTestingModule } from "ngx-translate-testing";
import { Workflow } from "~/lib/common/app/workflow/endpoints";
import { EntityOrder } from "~/lib/common/endpoints";
import { ListSortColumns } from "~/lib/ng/lib/mat-list/list-sort.columns";

import { WorkflowListComponent } from "./workflow.list.component";

describe("WorkflowListComponent", () => {
	describe("Static ListQuery to ApiQuery", () => {
		it("should convert the orders", () => {
			const query1 = WorkflowListComponent.listQueryToApiQuery({
				sort: new ListSortColumns()
			});
			expect(query1.order).toHaveLength(0);

			const query2 = WorkflowListComponent.listQueryToApiQuery({
				sort: new ListSortColumns([
					{ column: "name", direction: "desc" },
					{ column: "_created_at", direction: "asc" }
				])
			});
			expect(query2.order).toHaveLength(2);
			expect(query2.order).toStrictEqual([
				{ name: "desc" },
				{ _created_at: "asc" }
			] satisfies Array<EntityOrder<Workflow>>);
		});
	});

	let component: WorkflowListComponent;
	let fixture: ComponentFixture<WorkflowListComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [WorkflowListComponent, TranslateTestingModule.withTranslations({})]
		}).compileComponents();

		fixture = TestBed.createComponent(WorkflowListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
