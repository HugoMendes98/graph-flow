import { CommonModule } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { WorkflowUpdateDto } from "~/lib/common/app/workflow/dtos";
import { WorkflowJSON } from "~/lib/common/app/workflow/endpoints";
import { FormControlsFrom } from "~/lib/ng/lib/forms";
import { TranslationModule } from "~/lib/ng/lib/translation";

@Component({
	selector: "app-workflow-update-card",
	standalone: true,
	styleUrls: ["./workflow-update.card.scss"],
	templateUrl: "./workflow-update.card.html",

	imports: [
		CommonModule,
		MatCardModule,
		MatInputModule,
		ReactiveFormsModule,
		MatButtonModule,
		MatSlideToggleModule,
		FormsModule,
		TranslationModule,
		MatProgressBarModule,
		MatIconModule
	]
})
export class WorkflowUpdateCard {
	/** The error on the request */
	@Input()
	public error?: HttpErrorResponse;

	/** Activates the loading mode, button is disable and fields are readonly  */
	@Input()
	public loading?: boolean;

	/**
	 * Data send when submitting
	 */
	@Output()
	public readonly update = new EventEmitter<WorkflowUpdateDto>();

	/** Form to update a workflow */
	protected readonly form = new FormGroup<FormControlsFrom<WorkflowUpdateDto>>({
		active: new FormControl(false, { nonNullable: true }),
		name: new FormControl("", { nonNullable: true, validators: [Validators.required] })
	});

	/** The workflow to manage in this card */
	@Input({ required: true })
	public set workflow(workflow: WorkflowJSON) {
		const { active, name } = workflow;
		this.form.setValue({ active, name });
		this.form.markAsDirty();
	}
}
