import { HttpErrorResponse } from "@angular/common/http";
import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/angular";
import { of } from "rxjs";
import { NodeJSON } from "~/lib/common/app/node/endpoints";
import { EntityFindResult } from "~/lib/common/endpoints";
import { BASE_SEED } from "~/lib/common/seeds";
import { jsonify } from "~/lib/common/utils/jsonify";
import {
	getRequestStateSnapshot,
	RequestState,
	RequestStateWithSnapshot
} from "~/lib/ng/lib/request-state";

import { NodeListComponent } from "./node.list.component";

const meta: Meta<NodeListComponent> = {
	component: NodeListComponent,
	title: "Node/components/list"
};
export default meta;
type Story = StoryObj<NodeListComponent>;

const db = jsonify(BASE_SEED);
const {
	graph: { nodes }
} = db;

const getRequestState = (
	state: RequestState<EntityFindResult<NodeJSON>>
): RequestStateWithSnapshot<EntityFindResult<NodeJSON>, HttpErrorResponse> => {
	return { ...state, snapshot: getRequestStateSnapshot(state) };
};

const state$ = of(
	getRequestState({
		data: {
			data: nodes.map((w, i) => ({ ...w, active: !(i % 2) })),
			pagination: {
				range: { end: nodes.length, start: 0 },
				total: nodes.length
			}
		},
		error: false,
		state: "success"
	})
);

const actionRowClick = action("rowClick");

export const Primary: Story = {
	args: { expanded: nodes[2]._id, previewEditUrl: () => "", state$ }
};

export const SelectNode: Story = {
	args: {
		columns: ["name", "behavior.type", "actions.expansion"],
		onRowClick: actionRowClick,
		state$
	}
};
