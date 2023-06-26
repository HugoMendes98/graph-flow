import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { GroupComponent } from "./groups/group/group.component";
import { MaterialModule } from "../material/material.module";
import { AppTranslationModule } from "../translation";

@NgModule({
	declarations: [GroupComponent],
	exports: [CommonModule, GroupComponent, MaterialModule],
	imports: [AppTranslationModule, CommonModule, MaterialModule, RouterModule]
})
export class ComponentsModule {}
