import { NgModule } from "@angular/core";

import { UserDisplayNamePipe } from "./pipes";
import { UserService } from "./user.service";

/**
 * A module for `user` related utilities
 */
@NgModule({
	declarations: [UserDisplayNamePipe],
	exports: [UserDisplayNamePipe],
	providers: [UserService]
})
export class UserModule {}
