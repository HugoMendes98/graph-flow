import { Schema } from "@nx/angular/src/generators/component/schema";

export interface ViewGeneratorSchema extends Pick<Schema, "name" | "project"> {
	/**
	 * Add the view to the dev module?
	 */
	dev: boolean;
}
