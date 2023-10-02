import { CommonModule } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, Inject } from "@angular/core";
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import {
	MAT_DIALOG_DATA,
	MatDialog,
	MatDialogConfig,
	MatDialogModule,
	MatDialogRef
} from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { DeepPartial } from "@mikro-orm/core";
import { TranslateModule } from "@ngx-translate/core";
import {
	debounceTime,
	distinctUntilChanged,
	filter,
	map,
	merge,
	Observable,
	of,
	switchMap,
	take,
	tap
} from "rxjs";
import type { WORKFLOW_NAME_MIN_LENGTH, WorkflowCreateDto } from "~/lib/common/app/workflow/dtos";
import { Workflow } from "~/lib/common/app/workflow/endpoints";
import { ApiModule } from "~/lib/ng/lib/api";
import { WorkflowApiService } from "~/lib/ng/lib/api/workflow-api";
import { FormControlsFrom } from "~/lib/ng/lib/forms";
import { RequestStateSubject, RequestStateWithSnapshot } from "~/lib/ng/lib/request-state";
import { TranslationModule } from "~/lib/ng/lib/translation";

/**
 * Data send when opening the dialog
 */
export interface WorkflowCreateDialogData {
	/**
	 * Initial data passed to the form
	 */
	initialData?: DeepPartial<WorkflowCreateDto>;
}
/**
 * The possible (when not canceled) results from the dialog
 */
export interface WorkflowCreateDialogResult {
	/**
	 * The created workflow
	 */
	created: Workflow;
}

interface WorkflowUniqueStateBase<T extends "ignore" | "verified" | "verifying"> {
	type: T;
}
interface WorkflowUniqueStatePreload extends WorkflowUniqueStateBase<"ignore" | "verifying"> {
	input: string;
}
interface WorkflowUniqueStateVerified extends WorkflowUniqueStateBase<"verified"> {
	state: RequestStateWithSnapshot<boolean, HttpErrorResponse>;
}
type WorkflowUniqueState = WorkflowUniqueStatePreload | WorkflowUniqueStateVerified;

@Component({
	standalone: true,
	styleUrls: ["./workflow-create.dialog.scss"],
	templateUrl: "./workflow-create.dialog.html",

	imports: [
		ApiModule,
		CommonModule,
		FormsModule,
		MatButtonModule,
		MatDialogModule,
		MatIconModule,
		MatInputModule,
		MatProgressSpinnerModule,
		ReactiveFormsModule,
		TranslateModule,
		TranslationModule
	]
})
export class WorkflowCreateDialog {
	/**
	 * Opens this dialog
	 *
	 * @param matDialog the matDialog service to open dialogs
	 * @param data the mandatory data to pass to the dialog
	 * @param config for the dialog
	 * @returns MatDialogRef
	 */
	public static open(
		matDialog: MatDialog,
		data?: WorkflowCreateDialogData,
		config?: Omit<MatDialogConfig, "data">
	) {
		return matDialog.open<
			WorkflowCreateDialog,
			WorkflowCreateDialogData,
			WorkflowCreateDialogResult
		>(WorkflowCreateDialog, {
			// Some default values
			maxWidth: "700px",
			minWidth: "350px",
			width: "50%",

			...config,
			data
		});
	}

	protected readonly requestCreate$ = new RequestStateSubject((body: WorkflowCreateDto) =>
		this.workflowApi.create(body)
	);

	/** Creating form */
	protected readonly form: FormGroup<FormControlsFrom<WorkflowCreateDto>>;
	protected readonly unique$: Observable<WorkflowUniqueState>;

	private readonly NAME_MIN_LENGTH = 2 satisfies typeof WORKFLOW_NAME_MIN_LENGTH;

	/**
	 * Constructor with "dependency injection"
	 *
	 * @param dialogData injected
	 * @param matDialogRef injected
	 * @param workflowApi injected
	 */
	public constructor(
		@Inject(MAT_DIALOG_DATA) dialogData: WorkflowCreateDialogData | undefined,
		private readonly matDialogRef: MatDialogRef<
			WorkflowCreateDialog,
			WorkflowCreateDialogResult
		>,
		private readonly workflowApi: WorkflowApiService
	) {
		this.form = new FormGroup({
			name: new FormControl(dialogData?.initialData?.name ?? "", {
				asyncValidators: [
					() =>
						this.unique$.pipe(
							filter(
								(event): event is WorkflowUniqueStateVerified =>
									event.type === "verified" &&
									(event.state.state === "failed" ||
										event.state.state === "success")
							),
							take(1),
							map(({ state }) => {
								if (
									(state.state === "success" && !state.data) ||
									state.state === "failed"
								) {
									return {
										uniqueness: "not-unique"
									};
								}

								return null;
							})
						)
				],
				nonNullable: true,
				validators: [Validators.required, Validators.minLength(this.NAME_MIN_LENGTH)]
			})
		});

		// The request to detect uniqueness of a workflow
		const requestState$ = new RequestStateSubject((name: string) =>
			this.workflowApi.count({ name }).then(total => total === 0)
		);

		// name input observable
		const name$ = this.form.controls.name.valueChanges.pipe(
			distinctUntilChanged(),
			map(
				input =>
					({
						input,
						type: input.length > this.NAME_MIN_LENGTH ? "verifying" : "ignore"
					} satisfies WorkflowUniqueStatePreload)
			)
		);

		const request$ = name$.pipe(
			filter(({ type }) => type === "verifying"),
			debounceTime(500),
			tap(({ input }) => void requestState$.request(input)),
			switchMap(() => requestState$),
			map(state => ({ state, type: "verified" } satisfies WorkflowUniqueStateVerified))
		);

		this.unique$ = merge(
			of({ input: "", type: "ignore" } satisfies WorkflowUniqueStatePreload),
			name$,
			request$
		).pipe(distinctUntilChanged());
	}

	/** Handle the form submit */
	protected handleSubmit() {
		if (this.form.invalid) {
			return;
		}

		void this.requestCreate$
			.request(this.form.getRawValue())
			.then(created => this.matDialogRef.close({ created }));
	}
}
