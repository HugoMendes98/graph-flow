import { CommonModule } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, ContentChild, Input, TemplateRef } from "@angular/core";
import { MatCardActions, MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { TranslateModule } from "@ngx-translate/core";

import { TranslationModule } from "../../../translation";

/**
 * An apology message card in case of http error.
 *
 * To mainly use when loading data.
 * Favour short messages for failed actions (e.g.: 'the action failed' under the button).
 */
@Component({
	selector: "ui-http-error-card",
	standalone: true,
	styleUrls: ["./http-error.card.scss"],
	templateUrl: "./http-error.card.html",

	imports: [CommonModule, MatCardModule, TranslateModule, MatIconModule, TranslationModule]
})
export class HttpErrorCard {
	/**
	 * Add some actions at the bottom of the card
	 */
	@ContentChild(MatCardActions, { descendants: false })
	public actions?: TemplateRef<unknown>;

	/**
	 * The error to display
	 */
	@Input({ required: true })
	public error!: HttpErrorResponse;
}
