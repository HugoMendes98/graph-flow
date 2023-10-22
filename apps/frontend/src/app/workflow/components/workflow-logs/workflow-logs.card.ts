import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { MatCardModule } from "@angular/material/card";

@Component({
	selector: "app-workflow-logs-card",
	standalone: true,
	styleUrls: ["./workflow-logs.card.scss"],
	templateUrl: "./workflow-logs.card.html",

	imports: [CommonModule, MatCardModule]
})
export class WorkflowLogsCard {}
