import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { ReteModule } from "rete-angular-plugin/16";
import { ReteNode } from "~/lib/ng/lib/rete";

@Component({
	selector: "app-rete-node",
	standalone: true,
	styleUrls: ["./rete.node.component.scss"],
	templateUrl: "./rete.node.component.html",

	imports: [CommonModule, ReteModule]
})
export class ReteNodeComponent {
	// TODO

	@Input({ required: true })
	public readonly data!: ReteNode;

	@Input({ required: true })
	public readonly emit!: (data: never) => void;

	/**
	 * From the library.
	 * It has been understood has to enable the render of a connection linked to this socket.
	 */
	@Input({ required: true })
	public readonly rendered!: () => void;
}
