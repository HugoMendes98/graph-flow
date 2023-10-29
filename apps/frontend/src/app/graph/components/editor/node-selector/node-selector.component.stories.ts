import { HttpErrorResponse } from "@angular/common/http";
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

import { NodeSelectorComponent } from "./node-selector.component";

const {
	graph: { nodes }
} = jsonify(BASE_SEED);

const getRequestState = (
	state: RequestState<EntityFindResult<NodeJSON>>
): RequestStateWithSnapshot<EntityFindResult<NodeJSON>, HttpErrorResponse> => {
	return { ...state, snapshot: getRequestStateSnapshot(state) };
};

const state$ = of(
	getRequestState({
		data: {
			data: nodes,
			pagination: {
				range: { end: nodes.length, start: 0 },
				total: nodes.length
			}
		},
		error: false,
		state: "success"
	})
);

const meta: Meta<NodeSelectorComponent> = {
	component: NodeSelectorComponent,
	title: "Graph/components/editor/node-preview"
};
export default meta;
type Story = StoryObj<NodeSelectorComponent>;

export const Primary: Story = { args: { nodes$: state$ } };
