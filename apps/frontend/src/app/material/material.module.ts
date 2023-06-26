import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";

@NgModule({
	exports: [MatButtonModule, MatIconModule, MatSidenavModule]
})
export class MaterialModule {}
