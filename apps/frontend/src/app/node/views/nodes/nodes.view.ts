import { Component } from "@angular/core";
import { NodeApiService } from "~/lib/ng/lib/api/node-api";

@Component({
	standalone: true,
	styleUrls: ["./nodes.view.scss"],
	templateUrl: "./nodes.view.html",

	imports: []
})
export class NodesView {
	/**
	 * Constructor with "dependency injection"
	 *
	 * @param apiService injected
	 */
	public constructor(private readonly apiService: NodeApiService) {}
}
