import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { MaterialModule } from "../material/material.module";
import { AppTranslationModule } from "../translation";

@NgModule({
	declarations: [],
	exports: [CommonModule, MaterialModule],
	imports: [AppTranslationModule, CommonModule, MaterialModule, RouterModule]
})
export class ComponentsModule {}
