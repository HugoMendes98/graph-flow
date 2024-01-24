import { CommonModule } from "@angular/common";
import {
	Component,
	ElementRef,
	Injector,
	Input,
	OnChanges,
	OnDestroy,
	Output,
	SimpleChanges,
	ViewChild
} from "@angular/core";
import { GetSchemes, NodeEditor, Root } from "rete";
import {
	AngularArea2D,
	AngularPlugin,
	Presets as AngularPresets
} from "rete-angular-plugin/16";
import { Area2D, AreaExtensions, AreaPlugin } from "rete-area-plugin";
import {
	ConnectionPlugin,
	Presets as ConnectionPresets
} from "rete-connection-plugin";
import { ReadonlyPlugin } from "rete-readonly-plugin";
import { bufferToggle, filter, map, Observable, Subject } from "rxjs";
import { GraphArcCreateDto } from "~/lib/common/app/graph/dtos/arc";
import { GraphArcJSON, GraphNodeJSON } from "~/lib/common/app/graph/endpoints";
import { NodeKindType } from "~/lib/common/app/node/dtos/kind/node-kind.type";
import { PositionDto } from "~/lib/common/app/node/dtos/position.dto";
import { NodeJSON } from "~/lib/common/app/node/endpoints";
import {
	ReteConnection,
	ReteInput,
	ReteNode,
	ReteOutput
} from "~/lib/ng/lib/rete";

import { ReteConnectionComponent } from "../../rete/connection/rete.connection.component";
import { ReteNodeComponent } from "../../rete/node/rete.node.component";
import { ReteSocketComponent } from "../../rete/socket/rete.socket.component";

type Schemes = GetSchemes<ReteNode, ReteConnection>;
type AreaExtra = AngularArea2D<Schemes>;

export interface NodeMoved {
	/**
	 * The new position of the node
	 */
	current: PositionDto;
	/**
	 * The node that has been moved
	 */
	node: NodeJSON;
	/**
	 * The previous position of the node
	 */
	previous: PositionDto;
}

/**
 * The possible actions on the graph when adding, removing content.
 * If not provided, the features are not enabled.
 */
export interface GraphActions {
	/**
	 * The actions on arcs
	 */
	arc?: {
		/**
		 * When an arc is being created
		 *
		 * Cancels the change if on any fail.
		 *
		 * @param toCreate the arc to create
		 * @returns the created arc
		 */
		create?: (toCreate: GraphArcCreateDto) => Promise<GraphArcJSON>;
		/**
		 * When an arc is being deleted
		 *
		 * Cancels the change if on any fail.
		 *
		 * @param arc to delete
		 * @returns An empty promise once the arc is deleted.
		 */
		remove?: (arc: GraphArcJSON) => Promise<void>;
	};
}

export interface GraphData {
	/** The arcs of the graph */
	arcs: readonly GraphArcJSON[];
	/** The nodes (with their inputs/outputs) of the graph */
	nodes: ReadonlyArray<GraphNodeJSON | NodeJSON>;
}

/**
 * Viewport information.
 *
 * All values are round to int (except zoom)
 */
export interface GraphViewPort {
	/** Height of the viewport (with zoom) */
	height: number;
	/** Middle position on the graph (with zoom) */
	middle: PositionDto;
	/** Top left position on the graph */
	position: PositionDto;
	/** Width of the viewport (with zoom) */
	width: number;
	/** Zoom of the viewport (bigger = closer) */
	zoom: number;
}

/**
 * The {@link GraphComponent} manages the whole graph view and edition (but only graph content)
 */
@Component({
	selector: "app-graph",
	standalone: true,
	styleUrls: ["./graph.component.scss"],
	templateUrl: "./graph.component.html",

	imports: [CommonModule]
})
export class GraphComponent implements OnDestroy, OnChanges {
	// FIXME: review all the component behavior (destroy, events, ...)

	/** The graph data to view */
	@Input({ required: true })
	public graph!: GraphData;

	/**
	 * Is the graph on readonly mode?
	 *
	 * @default true
	 */
	@Input()
	public readonly? = true;

	/** The actions to update the graph */
	@Input()
	public actions: GraphActions = {};

	/** When a node has been moved on the graph */
	@Output()
	public readonly nodeMoved: Observable<NodeMoved>;

	// The ref to this component is not used, so content can more easily be added to this component (context menu, pop-ups, ...)
	@ViewChild("graph", { static: true })
	private readonly container!: ElementRef<HTMLElement>;

	/**
	 * `rete` library instances.
	 * Used to clean when the component is destroyed and some actions.
	 */
	private rete?: {
		area: AreaPlugin<Schemes, AreaExtra>;
		editor: NodeEditor<Schemes>;
		readonly: ReadonlyPlugin<Schemes>;
	};

	/**
	 * Observable on the area events.
	 * To pipe and use only what is needed
	 */
	private readonly area$ = new Subject<
		Area2D<Schemes> | AreaExtra | Root<Schemes>
	>();

	private destroyed = false;

	public constructor(private readonly injector: Injector) {
		this.nodeMoved = this.area$.pipe(
			// Only want the translation and when the node is dragged
			filter(
				({ type }) =>
					type === "nodetranslated" || type === "nodedragged"
			),
			bufferToggle(
				// Start buffering when the node is picked
				this.area$.pipe(filter(({ type }) => type === "nodepicked")),
				// And stop when it is dragged
				() =>
					this.area$.pipe(
						filter(({ type }) => type === "nodedragged")
					)
			),
			// Ignore when there is not enough emits
			filter(buffer => 3 <= buffer.length),
			map(([previous, ...rest]) => {
				const [node, current] = rest.slice().reverse();

				// For type inference
				if (
					previous.type === "nodetranslated" &&
					current.type === "nodetranslated" &&
					node.type === "nodedragged"
				) {
					return {
						current: current.data.position,
						node: node.data.node,
						previous: previous.data.previous
					} satisfies NodeMoved;
				}

				throw new Error("Should not happen");
			}),
			// Ignore if the node is just clicked or been moved to the same place
			filter(
				({ current, previous }) =>
					previous.x !== current.x || previous.y !== current.y
			)
		);
	}

	public ngOnChanges(changes: SimpleChanges) {
		// TODO: with a `set` on the input ?
		const simpleChange = changes["readonly" satisfies keyof this];
		if ((simpleChange as unknown) && this.rete) {
			if (simpleChange.currentValue ?? true) {
				this.rete.readonly.enable();
			} else {
				this.rete.readonly.disable();
			}
		}

		if (("graph" satisfies keyof this) in changes) {
			void this.destroyRete().then(() => this.initRete());
		}
	}

	/** @inheritDoc */
	public async ngOnDestroy() {
		this.area$.complete();
		await this.destroyRete();
	}

	/**
	 * Determines the current viewport (and its middle position)
	 *
	 * @returns the current viewport of the graph (all zero when not set)
	 */
	public getCurrentViewPort(): GraphViewPort {
		const { area } = this.rete ?? {};
		if (!area) {
			return {
				height: 0,
				middle: { x: 0, y: 0 },
				position: { x: 0, y: 0 },
				width: 0,
				zoom: 1
			};
		}

		const {
			area: {
				transform: { k: zoom, x, y }
			},
			container: { offsetHeight, offsetWidth }
		} = area;

		const [posX, posY] = [x, y].map(v => Math.round(-v));
		const [height, width] = [offsetHeight, offsetWidth].map(v =>
			Math.round(v / zoom)
		);
		const [midX, midY] = [
			Math.round(posX + width / 2),
			Math.round(posY + height / 2)
		];
		return {
			height,
			middle: { x: midX, y: midY },
			position: { x: posX, y: posY },
			width,
			zoom
		};
	}

	/** @inheritDoc */
	private async initRete() {
		this.destroyed = false;

		const area = new AreaPlugin<Schemes, AreaExtra>(
			this.container.nativeElement
		);
		const connection = new ConnectionPlugin<Schemes, AreaExtra>();
		const editor = new NodeEditor<Schemes>();
		const readonlyPlugin = new ReadonlyPlugin<Schemes>();

		this.rete = { area, editor, readonly: readonlyPlugin };

		// Set editor
		const render = new AngularPlugin<Schemes, AreaExtra>({
			injector: this.injector
		});

		render.addPreset(
			AngularPresets.classic.setup({
				customize: {
					connection: () => ReteConnectionComponent,
					node: () => ReteNodeComponent,
					socket: () => ReteSocketComponent
				}
			})
		);
		connection.addPreset(ConnectionPresets.classic.setup());

		editor.use(readonlyPlugin.root);
		editor.use(area);

		area.use(readonlyPlugin.area);
		area.use(connection);
		area.use(render);

		// Background
		const background = document.createElement("div");
		const graphSize = 25;
		background.id = "graph-grid";
		background.style.setProperty("--grid-size", `${graphSize}px`);
		area.area.content.add(background);

		const inputsMap = new Map<number, ReteInput>();
		const outputsMap = new Map<number, ReteOutput>();

		const { arcs, nodes } = this.graph;
		for (const node of nodes) {
			const { kind } = node;
			if (kind.type !== NodeKindType.VERTEX) {
				continue;
			}

			const { position } = kind;
			const reteNode = new ReteNode(node);

			for (const input of Object.values(reteNode.inputs) as ReteInput[]) {
				inputsMap.set(input.input._id, input);
			}

			for (const output of Object.values(
				reteNode.outputs
			) as ReteOutput[]) {
				outputsMap.set(output.output._id, output);
			}

			// Always add the node first
			await editor.addNode(reteNode);
			await area.translate(reteNode.id, position);
		}

		for (const arc of arcs) {
			const { __from, __to } = arc;
			const output = outputsMap.get(__from);
			const input = inputsMap.get(__to);

			if (input && output) {
				await editor.addConnection(
					new ReteConnection(arc, output, input)
				);
			}
		}

		// FIXME
		// await AreaExtensions.zoomAt(area, editor.getNodes());
		AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
			accumulating: AreaExtensions.accumulateOnCtrl()
		});
		AreaExtensions.snapGrid(area, { dynamic: true, size: graphSize });

		// TODO: on readonly changes
		if (this.readonly ?? true) {
			readonlyPlugin.enable();

			// There is a bug in the library that allows to visually modify arcs
			area.addPipe(() => undefined);
			editor.addPipe(() => undefined);
			return;
		}

		// Only add at the end to avoid triggering the event for the construction of the component
		area.addPipe(context => {
			if (this.destroyed) {
				return;
			}

			// TODO: filters?
			this.area$.next(context);
			return context;
		});

		editor.addPipe(context => {
			if (this.destroyed) {
				return;
			}

			if (context.type === "connectioncreate") {
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- The library still uses the default Connection class
				if (context.data.arc) {
					return context;
				}

				const { actions } = this;
				if (!actions.arc?.create) {
					return undefined;
				}

				const source = editor.getNode(context.data.source);
				const target = editor.getNode(context.data.target);

				const sourceOutput = source.outputs[context.data.sourceOutput];
				const targetInput = target.inputs[context.data.targetInput];

				if (!sourceOutput || !targetInput) {
					return undefined;
				}

				// TODO: Test cyclic here, before continuing
				return (
					actions.arc
						.create({
							__from: sourceOutput.output._id,
							__to: targetInput.input._id
						})
						.then(async arc => {
							// FIXME: return a modified context (library does not keep the custom `ReteConnection`)
							await this.rete?.editor.addConnection(
								new ReteConnection(
									arc,
									sourceOutput,
									targetInput
								)
							);

							return undefined;
						})
						// TODO: error message
						.catch(() => undefined)
				);
			}

			if (context.type === "connectionremove") {
				const { actions } = this;
				if (!actions.arc?.remove) {
					return undefined;
				}

				return (
					actions.arc
						.remove(context.data.arc)
						.then(() => context)
						// TODO: error message
						.catch(() => undefined)
				);
			}

			return context;
		});
	}

	private async destroyRete() {
		this.destroyed = true;
		if (!this.rete) {
			return;
		}

		const { area, editor } = this.rete;
		area.container.innerHTML = "";
		area.destroy();
		await editor.clear();
	}

	// TODO: some buttons/actions:
	//  - center view
	//	- ...
}
