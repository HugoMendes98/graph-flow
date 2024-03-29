import type { Meta, StoryObj } from "@storybook/angular";
import { BASE_SEED } from "~/lib/common/seeds";
import { jsonify } from "~/lib/common/utils/jsonify";

import { GraphEditorView } from "./graph-editor.view";

const meta: Meta<GraphEditorView> = {
	component: GraphEditorView,
	title: "Graph/components/editor/view"
};
export default meta;
type Story = StoryObj<GraphEditorView>;

const {
	graph: { graphs }
} = jsonify(BASE_SEED);

export const Primary: Story = {
	args: { graphId: graphs[0]._id, readonly: false }
};
