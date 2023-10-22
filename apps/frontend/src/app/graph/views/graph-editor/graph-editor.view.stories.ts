import type { Meta, StoryObj } from "@storybook/angular";
import { BASE_SEED } from "~/lib/common/seeds";
import { jsonify } from "~/lib/common/utils/jsonify";

import { GraphEditorView } from "./graph-editor.view";

const meta: Meta<GraphEditorView> = {
	component: GraphEditorView,
	title: "GraphEditorView"
};
export default meta;
type Story = StoryObj<GraphEditorView>;

const {
	graph: { graphs }
} = jsonify(BASE_SEED);

export const Primary: Story = { args: { graph: graphs[0], readonly: false } };
