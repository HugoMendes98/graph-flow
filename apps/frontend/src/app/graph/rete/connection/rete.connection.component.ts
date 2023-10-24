import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { Position } from "rete-angular-plugin/types";
import { ReteConnection } from "~/lib/ng/lib/rete";

@Component({
	selector: "app-rete-connection",
	standalone: true,
	styleUrls: ["./rete.connection.component.scss"],
	templateUrl: "./rete.connection.component.html",

	imports: [CommonModule]
})
export class ReteConnectionComponent {
	// TODO

	@Input({ required: true })
	public readonly data!: ReteConnection;
	@Input({ required: true })
	public readonly start!: Position;
	@Input({ required: true })
	public readonly end!: Position;
	@Input({ required: true })
	public readonly path!: string;
}
