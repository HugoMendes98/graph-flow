import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TranslateTestingModule } from "ngx-translate-testing";
import { NodeJSON } from "~/lib/common/app/node/endpoints";
import { EntityOrder } from "~/lib/common/endpoints";
import { ListSortColumns } from "~/lib/ng/lib/mat-list/list-sort.columns";

import { NodeListComponent } from "./node.list.component";

describe("NodeListComponent", () => {
	describe("Static ListQuery to ApiQuery", () => {
		it("should convert the orders", () => {
			const query1 = NodeListComponent.listQueryToApiQuery({
				sort: new ListSortColumns()
			});
			expect(query1.order).toHaveLength(0);

			const query2 = NodeListComponent.listQueryToApiQuery({
				sort: new ListSortColumns([
					{ column: "kind.active", direction: "desc" },
					{ column: "name", direction: "asc" },
					{ column: "behavior.type", direction: "desc" }
				])
			});

			const expected: Array<EntityOrder<NodeJSON>> = [
				{ kind: { active: "desc" } },
				{ name: "asc" },
				{ behavior: { type: "desc" } }
			];
			expect(query2.order).toHaveLength(expected.length);
			expect(query2.order).toStrictEqual(expected);
		});
	});

	let component: NodeListComponent;
	let fixture: ComponentFixture<NodeListComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [NodeListComponent, TranslateTestingModule.withTranslations({})]
		}).compileComponents();

		fixture = TestBed.createComponent(NodeListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
