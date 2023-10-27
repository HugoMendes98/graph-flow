import { HttpErrorResponse } from "@angular/common/http";
import { RouterTestingModule } from "@angular/router/testing";
import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";
import { of } from "rxjs";
import { WorkflowJSON } from "~/lib/common/app/workflow/endpoints";
import { EntityFindResult } from "~/lib/common/endpoints";
import { BASE_SEED } from "~/lib/common/seeds";
import { jsonify } from "~/lib/common/utils/jsonify";
import { ListSortColumns } from "~/lib/ng/lib/mat-list/list-sort.columns";
import {
	getRequestStateSnapshot,
	RequestState,
	RequestStateWithSnapshot
} from "~/lib/ng/lib/request-state";

import { WorkflowListComponent } from "./workflow.list.component";

const meta: Meta<WorkflowListComponent> = {
	component: WorkflowListComponent,
	decorators: [moduleMetadata({ imports: [RouterTestingModule] })],
	title: "Workflow/components/list"
};
export default meta;
type Story = StoryObj<WorkflowListComponent>;

const db = jsonify(BASE_SEED);
const { workflows } = db;

const getRequestState = (
	state: RequestState<EntityFindResult<WorkflowJSON>>
): RequestStateWithSnapshot<EntityFindResult<WorkflowJSON>, HttpErrorResponse> => {
	return { ...state, snapshot: getRequestStateSnapshot(state) };
};

const state$ = of(
	getRequestState({
		data: {
			data: workflows.map((w, i) => ({ ...w, active: !(i % 2) })),
			pagination: {
				range: { end: workflows.length, start: 0 },
				total: workflows.length
			}
		},
		error: false,
		state: "success"
	})
);

export const Primary: Story = {
	args: {
		query: {
			sort: new ListSortColumns([
				{ column: "name", direction: "asc" },
				{ column: "active", direction: "desc" }
			])
		},
		rowUrl: () => "",
		state$
	}
};
export const Clean: Story = { args: { state$ } };

export const ChangeColumns: Story = { args: { columns: ["name", "active", "_id"], state$ } };
