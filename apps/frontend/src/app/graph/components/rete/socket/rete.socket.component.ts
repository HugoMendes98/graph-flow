import { CommonModule } from "@angular/common";
import { Component, Input, OnChanges } from "@angular/core";
import { ReteSocket } from "~/lib/ng/lib/rete";

@Component({
	selector: "app-rete-socket",
	standalone: true,
	styleUrls: ["./rete.socket.component.scss"],
	templateUrl: "./rete.socket.component.html",

	imports: [CommonModule]
})
export class ReteSocketComponent implements OnChanges {
	// TODO (input (& dummy) vs output (& void))

	@Input({ required: true })
	public readonly data!: ReteSocket;

	/**
	 * From the library.
	 * It has been understood has to enable the render of a connection linked to this socket.
	 */
	@Input({ required: true })
	public readonly rendered!: () => void;

	/** @inheritDoc */
	public ngOnChanges(): void {
		requestAnimationFrame(() => this.rendered());
	}
}
