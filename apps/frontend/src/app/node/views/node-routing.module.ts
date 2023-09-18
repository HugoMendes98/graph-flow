import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { NODE_ROUTES } from "./node.routes";

@NgModule({ imports: [RouterModule.forChild(NODE_ROUTES)] })
export class NodeRoutingModule {}
