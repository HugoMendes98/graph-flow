import { RouterTestingModule } from "@angular/router/testing";
import { Meta, moduleMetadata } from "@storybook/angular";

import { AppComponent } from "./app.component";
import { FooterComponent } from "./footer/footer.component";
import { HeaderComponent } from "./header/header.component";
import { MaterialModule } from "../../material/material.module";

export const Primary = {
	args: {},
	render: (args: AppComponent) => ({
		props: args
	})
};

export default {
	component: AppComponent,
	decorators: [
		moduleMetadata({
			declarations: [AppComponent, FooterComponent, HeaderComponent],
			imports: [MaterialModule, RouterTestingModule]
		})
	],
	title: "AppComponent"
} satisfies Meta<AppComponent>;
