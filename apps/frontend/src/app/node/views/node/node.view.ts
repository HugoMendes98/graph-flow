import { Component, Input } from "@angular/core";
import { EntityId } from "~/lib/common/dtos/entity";
import { NodeApiService } from "~/lib/ng/lib/api/node-api";
import { RequestStateSubject } from "~/lib/ng/lib/request-state";

@Component({
	standalone: true,
	styleUrls: ["./node.view.scss"],
	templateUrl: "./node.view.html",

	imports: []
})
export class NodeView {
	protected readonly requestState$ = new RequestStateSubject((nodeId: EntityId) =>
		this.apiService.findById(nodeId)
	);

	@Input({ required: true, transform: (query: string) => +query })
	public set nodeId(id: EntityId) {
		void this.requestState$.request(id);
	}

	/**
	 * Constructor with "dependency injection"
	 *
	 * @param apiService injected
	 */
	public constructor(private readonly apiService: NodeApiService) {}
}
