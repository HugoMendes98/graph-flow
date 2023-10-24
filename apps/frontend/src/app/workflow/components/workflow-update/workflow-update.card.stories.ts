import type { Meta, StoryObj } from "@storybook/angular";
import { BASE_SEED } from "~/lib/common/seeds";
import { jsonify } from "~/lib/common/utils/jsonify";

import { WorkflowUpdateCard } from "./workflow-update.card";

const meta: Meta<WorkflowUpdateCard> = {
	component: WorkflowUpdateCard,
	title: "Workflow/cards/update"
};
export default meta;
type Story = StoryObj<WorkflowUpdateCard>;

const { workflows } = jsonify(BASE_SEED);

export const Primary: Story = { args: { workflow: workflows[0] } };
