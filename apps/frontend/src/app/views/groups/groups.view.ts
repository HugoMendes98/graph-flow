import { Component, OnInit } from "@angular/core";
import { type GroupResultsDto } from "~/app/common/dtos/group";
import { GroupApiService } from "~/app/ng/lib/api/group-api";

@Component({
	styleUrls: ["./groups.view.scss"],
	templateUrl: "./groups.view.html"
})
export class GroupsView implements OnInit {
	public data?: GroupResultsDto;

	public constructor(private readonly service: GroupApiService) {}

	public async ngOnInit() {
		await this.reload();
	}

	public reload() {
		// TODO: class-transformer for the API?
		return this.service.findAndCount().then(result => (this.data = result as never));
	}
}
