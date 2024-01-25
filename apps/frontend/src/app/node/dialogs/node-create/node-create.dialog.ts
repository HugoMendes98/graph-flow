import { CommonModule } from "@angular/common";
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
import { MatSelectModule } from "@angular/material/select";
import type {
	NODE_NAME_MIN_LENGTH,
	NodeCreateDto
} from "~/lib/common/app/node/dtos";
import {
	NODE_BEHAVIOR_TYPES,
	NodeBehaviorType
} from "~/lib/common/app/node/dtos/behaviors/node-behavior.type";
import { NodeTriggerType } from "~/lib/common/app/node/dtos/behaviors/triggers/node.trigger.type";
import { NodeJSON } from "~/lib/common/app/node/endpoints";
import { NodeApiService } from "~/lib/ng/lib/api/node-api";
import { FormControlsFrom } from "~/lib/ng/lib/forms";
import { RequestStateSubject } from "~/lib/ng/lib/request-state";
import { TranslationModule } from "~/lib/ng/lib/translation";

import { NodeBehaviorComponent } from "../../components/node-behavior/node-behavior.component";

/**
 * Data send when opening the dialog
 */
export interface NodeCreateDialogData {
	/**
	 * Array of authorized types
	 */
	behaviorTypes?: readonly NodeBehaviorType[];
	/**
	 * Initial data passed to the form.
	 * The kind of the node is mandatory.
	 *
	 * Note!: only the type of behavior is taken
	 */
	initialData: Partial<Pick<NodeCreateDto, "behavior" | "name">> &
		Pick<NodeCreateDto, "kind">;
}
/**
 * The possible (when not canceled) results from the dialog
 */
export interface NodeCreateDialogResult {
	/**
	 * The created node
	 */
	created: NodeJSON;
}

@Component({
	standalone: true,
	styleUrls: ["./node-create.dialog.scss"],
	templateUrl: "./node-create.dialog.html",

	imports: [
		CommonModule,
		TranslationModule,
		MatButtonModule,
		MatDialogModule,
		MatInputModule,
		ReactiveFormsModule,
		MatIconModule,
		FormsModule,
		NodeBehaviorComponent,
		MatSelectModule
	]
})
export class NodeCreateDialog {
	// This dialog is currently very simple
	//  TODO: a more complex dialog that allows to already:
	//  - Create `variable` with it's type and value
	//  - Create `code` preview
	//  - Create `trigger` and subtypes

	/** Default behavior types when creating a node template */
	public static readonly NODE_TEMPLATE_BEHAVIOR_TYPES =
		NODE_BEHAVIOR_TYPES.filter(
			(
				type
			): type is Exclude<
				NodeBehaviorType,
				| NodeBehaviorType.PARAMETER_IN
				| NodeBehaviorType.PARAMETER_OUT
				| NodeBehaviorType.REFERENCE
			> =>
				type !== NodeBehaviorType.PARAMETER_IN &&
				type !== NodeBehaviorType.PARAMETER_OUT &&
				type !== NodeBehaviorType.REFERENCE
		);

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
		return matDialog.open<
			NodeCreateDialog,
			NodeCreateDialogData,
			NodeCreateDialogResult
		>(NodeCreateDialog, {
			// Some default values
			maxWidth: "600px",
			minWidth: "350px",
			width: "40%",

			...config,
			data
		});
	}

	protected readonly requestCreate$ = new RequestStateSubject(
		(body: NodeCreateDto) => this.nodeApi.create(body)
	);

	/** Creating form */
	protected readonly form: FormGroup<
		FormControlsFrom<Pick<NodeCreateDto, "name">> & {
			behavior: FormControl<
				Exclude<NodeBehaviorType, NodeBehaviorType.REFERENCE>
			>;
		}
	>;
	protected readonly BEHAVIOR_TYPES: ReadonlyArray<
		Exclude<NodeBehaviorType, NodeBehaviorType.REFERENCE>
	>;

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
		private readonly matDialogRef: MatDialogRef<
			NodeCreateDialog,
			NodeCreateDialogResult
		>,
		private readonly nodeApi: NodeApiService
	) {
		const {
			behaviorTypes = NODE_BEHAVIOR_TYPES,
			initialData: { behavior, kind, name }
		} = dialogData;

		this.BEHAVIOR_TYPES = behaviorTypes.filter(
			(
				type
			): type is Exclude<NodeBehaviorType, NodeBehaviorType.REFERENCE> =>
				type !== NodeBehaviorType.REFERENCE
		);
		this.kind = kind;

		this.form = new FormGroup({
			behavior: new FormControl(
				(behavior?.type ?? null) as Exclude<
					NodeBehaviorType,
					NodeBehaviorType.REFERENCE
				>,
				{
					nonNullable: true,
					validators: [
						Validators.required,
						control =>
							behaviorTypes.includes(control.value as never)
								? null
								: {
										"invalid-type": {
											type: control.value as never
										}
									}
					]
				}
			),
			name: new FormControl(name ?? "", {
				nonNullable: true,
				validators: [
					Validators.required,
					Validators.minLength(
						2 satisfies typeof NODE_NAME_MIN_LENGTH
					)
				]
			})
		});
	}

	/** Handle the form submit */
	protected handleSubmit() {
		if (this.form.invalid) {
			return;
		}

		const { behavior, name } = this.form.getRawValue();
		void this.requestCreate$
			.request({
				behavior: this.getDefaultBehavior(behavior),
				kind: this.kind,
				name
			})
			.then(created => this.matDialogRef.close({ created }));
	}

	private getDefaultBehavior(
		type: Exclude<NodeBehaviorType, NodeBehaviorType.REFERENCE>
	): NodeCreateDto["behavior"] {
		switch (type) {
			case NodeBehaviorType.CODE:
				return { code: "", type };
			case NodeBehaviorType.FUNCTION:
			case NodeBehaviorType.PARAMETER_IN:
			case NodeBehaviorType.PARAMETER_OUT:
				return { type };
			case NodeBehaviorType.TRIGGER:
				return {
					trigger: { cron: "* * * * 5", type: NodeTriggerType.CRON },
					type
				};
			case NodeBehaviorType.VARIABLE:
				return { type, value: "" };
		}
	}
}
