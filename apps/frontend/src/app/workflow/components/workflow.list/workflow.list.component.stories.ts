import { HttpErrorResponse } from "@angular/common/http";
import type { Meta, StoryObj } from "@storybook/angular";
import { of } from "rxjs";
import { Workflow } from "~/lib/common/app/workflow/endpoints";
import { EntityFindResult } from "~/lib/common/endpoints";
import { BASE_SEED } from "~/lib/common/seeds";
import { jsonify } from "~/lib/common/utils/jsonify";
import {
	getRequestStateSnapshot,
	RequestState,
	RequestStateWithSnapshot
} from "~/lib/ng/lib/request-state";

import { WorkflowListComponent } from "./workflow.list.component";

const meta: Meta<WorkflowListComponent> = {
	component: WorkflowListComponent,
	title: "WorkflowListComponent"
};
export default meta;
type Story = StoryObj<WorkflowListComponent>;

const db = jsonify(BASE_SEED);
const { workflows } = db;

const getRequestState = (
	state: RequestState<EntityFindResult<Workflow>>
): RequestStateWithSnapshot<EntityFindResult<Workflow>, HttpErrorResponse> => {
	return { ...state, snapshot: getRequestStateSnapshot(state) };
};

export const Primary: Story = {
	args: {
		state$: of(
			getRequestState({
				data: {
					data: workflows,
					pagination: {
						range: { end: workflows.length, start: 0 },
						total: workflows.length
					}
				},
				error: false,
				state: "success"
			})
		)
	}
};
