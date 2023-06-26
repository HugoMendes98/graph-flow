import { INestApplicationContext } from "@nestjs/common/interfaces/nest-application-context.interface";
import { GlobalThis as GlobalThisBase } from "~/app/backend/test/support/global-this.type";

interface JestE2eConfig {
	/**
	 * Use this to access backend code/module
	 *
	 * @example
	 */
	backend: INestApplicationContext;
}

export interface GlobalThis extends GlobalThisBase {
	jest_config: GlobalThisBase["jest_config"] & JestE2eConfig;
}
