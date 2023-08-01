import { CommonModule } from "@angular/common";
import {
	AfterViewInit,
	Component,
	ElementRef,
	Injector,
	Input,
	OnChanges,
	OnDestroy,
	SimpleChanges,
	ViewChild
} from "@angular/core";
import { ClassicPreset, GetSchemes, NodeEditor } from "rete";
import { AngularArea2D, AngularPlugin, Presets as AngularPresets } from "rete-angular-plugin/16";
import { AreaExtensions, AreaPlugin } from "rete-area-plugin";
import { ConnectionPlugin, Presets as ConnectionPresets } from "rete-connection-plugin";
import { ReadonlyPlugin } from "rete-readonly-plugin";
import { GraphArc, GraphNode } from "~/lib/common/app/graph/endpoints";

// TODO: create classes that wrap the GraphNodeDto
type Node = ClassicPreset.Node;

type Schemes = GetSchemes<Node, ClassicPreset.Connection<Node, Node>>;
type AreaExtra = AngularArea2D<Schemes>;

/**
 * The {@link GraphComponent} manages the whole graph view and edition
 */
@Component({
	selector: "app-graph",
	standalone: true,
	styleUrls: ["./graph.component.scss"],
	templateUrl: "./graph.component.html",

	imports: [CommonModule]
})
export class GraphComponent implements AfterViewInit, OnDestroy, OnChanges {
	/**
	 * The arcs of the graphs
	 */
	@Input({ required: true })
	public arcs!: readonly GraphArc[];

	/**
	 * The nodes (with their inputs/outputs) of the graphs
	 */
	@Input({ required: true })
	public nodes!: readonly GraphNode[];

	/**
	 * Is the graph on readonly mode?
	 *
	 * @default true
	 */
	@Input()
	public readonly = true;

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

	public constructor(private readonly injector: Injector) {}

	/**
	 * @inheritDoc
	 */
	public async ngAfterViewInit() {
		const area = new AreaPlugin<Schemes, AreaExtra>(this.container.nativeElement);
		const connection = new ConnectionPlugin<Schemes, AreaExtra>();
		const editor = new NodeEditor<Schemes>();
		const readonlyPlugin = new ReadonlyPlugin<Schemes>();

		this.rete = { area, editor, readonly: readonlyPlugin };

		// Set editor
		const render = new AngularPlugin<Schemes, AreaExtra>({ injector: this.injector });

		render.addPreset(AngularPresets.classic.setup());
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

		// Add nodes/arcs from inputs
		const socket = new ClassicPreset.Socket("socket");

		const inputsToNode = new Map<number, ClassicPreset.Node>();
		const outputsToNode = new Map<number, ClassicPreset.Node>();

		for (const { inputs, name, outputs, position } of this.nodes) {
			const node = new ClassicPreset.Node(name);

			for (const { _id } of inputs) {
				node.addInput(_id.toString(), new ClassicPreset.Input(socket));
				inputsToNode.set(_id, node);
			}

			for (const { _id } of outputs) {
				node.addOutput(_id.toString(), new ClassicPreset.Output(socket));
				outputsToNode.set(_id, node);
			}

			// Always add the node first
			await editor.addNode(node);
			await area.translate(node.id, position);
		}

		for (const { __from, __to } of this.arcs) {
			const output = outputsToNode.get(__from);
			const input = inputsToNode.get(__to);

			if (input && output) {
				await editor.addConnection(
					new ClassicPreset.Connection<Node, Node>(
						output,
						__from.toString(),
						input,
						__to.toString()
					)
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
		if (this.readonly) {
			readonlyPlugin.enable();
		}
	}

	/**
	 * @inheritDoc
	 */
	public async ngOnDestroy() {
		if (!this.rete) {
			return;
		}

		const { area, editor } = this.rete;

		area.destroy();
		await editor.clear();
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
	}

	// TODO: some buttons/actions:
	//  - center view
	//	- ...
}
