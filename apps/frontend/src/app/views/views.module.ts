import { NgModule } from "@angular/core";

import { AppComponent } from "./_layout/app.component";
import { FooterComponent } from "./_layout/footer/footer.component";
import { HeaderComponent } from "./_layout/header/header.component";
import { GroupsView } from "./groups/groups.view";
import { IndexView } from "./index/index.view";
import { NotFoundView } from "./not-found/not-found.view";
import { ComponentsModule } from "../components/components.module";
import { AppRouterModule } from "../router";

@NgModule({
	declarations: [
		AppComponent,
		FooterComponent,
		GroupsView,
		HeaderComponent,
		IndexView,
		NotFoundView
	],
	imports: [AppRouterModule, ComponentsModule]
})
export class ViewsModule {}
