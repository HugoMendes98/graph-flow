import { HttpErrorResponse } from "@angular/common/http";
import { MatCardModule } from "@angular/material/card";
import { action } from "@storybook/addon-actions";
import type { Meta, StoryFn, StoryObj } from "@storybook/angular";

import { RequestStateWrapperComponent } from "./request-state-wrapper.component";
import { RequestState } from "../../request-state";

const meta: Meta<RequestStateWrapperComponent> = {
	component: RequestStateWrapperComponent,
	title: "RequestStateWrapperComponent"
};
export default meta;
type Story = StoryObj<RequestStateWrapperComponent>;

type RState = RequestState<never>;

const stateInit: RState = { state: "init" };
const stateLoading: RState = { error: false, state: "loading" };
const stateFailed: RState = {
	error: new HttpErrorResponse({ status: 404 }),
	state: "failed"
};

export const Primary: Story = {
	args: { requestState: stateLoading }
};

export const OnInit: Story = {
	args: { initAsLoading: true, requestState: stateInit }
};

export const OnError: Story = {
	args: { requestState: stateFailed }
};

const getOnUseTemplate = (template: string, action?: string) => `
	<div style="height: 400px; width: 600px; background-color: grey; position: relative">
		${template}

		<ui-request-state-wrapper [requestState]="requestState" class="absolute absolute-centered">
			${action ?? ""}
		</ui-request-state-wrapper>
	</div>
`;

export const OnUseLoading: StoryFn = args => ({
	props: {
		requestState: stateLoading,
		...args
	} satisfies Partial<RequestStateWrapperComponent>,
	template: getOnUseTemplate(`<p>Some skeleton, or content</p>`)
});

const onAction = action("Error action");
export const OnUseErrorWithActions: StoryFn = args => ({
	props: {
		actionEvent: () => onAction(),
		requestState: stateFailed,
		...args
	} satisfies Partial<RequestStateWrapperComponent> & {
		actionEvent: () => void;
	},
	template: getOnUseTemplate(
		`<p>Previous data?</p>`,
		`<mat-card-actions><button (click)="actionEvent()">Retry</button></mat-card-actions>`
	)
});

export const OnUseLoadingAndError: StoryFn = args => ({
	moduleMetadata: { imports: [MatCardModule] },
	props: {
		requestState: { error: stateFailed.error, state: "loading" },
		...args
	} satisfies Partial<RequestStateWrapperComponent>,
	template: getOnUseTemplate(`<p>Previous data?</p>`)
});
