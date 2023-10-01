import { CommonModule } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import {
	MAT_DIALOG_DATA,
	MatDialog,
	MatDialogConfig,
	MatDialogModule,
	MatDialogRef
} from "@angular/material/dialog";
import type { NODE_NAME_MIN_LENGTH, NodeCreateDto } from "~/lib/common/app/node/dtos";
import { Node } from "~/lib/common/app/node/endpoints";
import { NodeApiService } from "~/lib/ng/lib/api/node-api";
import { FormControlsFrom } from "~/lib/ng/lib/forms";
import { RequestStateSubject } from "~/lib/ng/lib/request-state";
import { TranslationModule } from "~/lib/ng/lib/translation";

/**
 * Data send when opening the dialog
 */
export interface NodeCreateDialogData {
	/**
	 * Initial data passed to the form.
	 *
	 * The kind of the node is necessary
	 */
	initialData: Partial<NodeCreateDto> & Pick<NodeCreateDto, "kind">;
}
/**
 * The possible (when not canceled) results from the dialog
 */
export interface NodeCreateDialogResult {
	/**
	 * The created node
	 */
	created: Node;
}

@Component({
	standalone: true,
	styleUrls: ["./node-create.dialog.scss"],
	templateUrl: "./node-create.dialog.html",

	imports: [CommonModule, TranslationModule, MatButtonModule, MatDialogModule]
})
export class NodeCreateDialog {
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
		data?: NodeCreateDialogData,
		config?: Omit<MatDialogConfig, "data">
	) {
		return matDialog.open<NodeCreateDialog, NodeCreateDialogData, NodeCreateDialogResult>(
			NodeCreateDialog,
			{
				// Some default values
				maxWidth: "600px",
				minWidth: "350px",
				width: "50%",

				...config,
				data
			}
		);
	}

	protected readonly requestCreate$ = new RequestStateSubject((body: NodeCreateDto) =>
		this.nodeApi.create(body)
	);

	protected readonly form: FormGroup<FormControlsFrom<Omit<NodeCreateDto, "kind">>>;

	private readonly kind: NodeCreateDto["kind"];

	/**
	 * Constructor with "dependency injection"
	 *
	 * @param dialogData injected
	 * @param matDialogRef injected
	 * @param nodeApi injected
	 */
	public constructor(
		@Inject(MAT_DIALOG_DATA) dialogData: NodeCreateDialogData,
		private readonly matDialogRef: MatDialogRef<NodeCreateDialog, NodeCreateDialogResult>,
		private readonly nodeApi: NodeApiService
	) {
		const { kind, name } = dialogData.initialData;

		this.kind = kind;
		this.form = new FormGroup({
			// TODO
			behavior: new FormControl(),
			name: new FormControl(name ?? "", {
				nonNullable: true,
				validators: [
					Validators.required,
					Validators.minLength(2 satisfies typeof NODE_NAME_MIN_LENGTH)
				]
			})
		});
	}

	protected handleSubmit() {
		if (this.form.invalid) {
			return;
		}

		void this.requestCreate$
			.request({ ...this.form.getRawValue(), kind: this.kind })
			.then(created => this.matDialogRef.close({ created }));
	}
}
