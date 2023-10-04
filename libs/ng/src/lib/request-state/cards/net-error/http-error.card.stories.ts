import { HttpErrorResponse } from "@angular/common/http";
import { MatCardModule } from "@angular/material/card";
import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj, StoryFn } from "@storybook/angular";

import { HttpErrorCard } from "./http-error.card";

const meta: Meta<HttpErrorCard> = {
	component: HttpErrorCard,
	title: "HttpErrorCard"
};
export default meta;
type Story = StoryObj<HttpErrorCard>;

const error404 = new HttpErrorResponse({ status: 404 });
const error500 = new HttpErrorResponse({ status: 500 });

export const Primary: Story = {
	args: { error: error404 }
};

const onAction = action("Error action");
export const WithActions: StoryFn<HttpErrorCard> = () => ({
	moduleMetadata: { imports: [MatCardModule] },
	props: {
		actionEvent: () => onAction(),
		error: error500
	} satisfies Partial<HttpErrorCard> & { actionEvent: () => void },
	template: `
		<ui-http-error-card [error]="error">
			<mat-card-actions><button (click)="actionEvent()">Retry</button></mat-card-actions>
		</ui-http-error-card>
	`
});
