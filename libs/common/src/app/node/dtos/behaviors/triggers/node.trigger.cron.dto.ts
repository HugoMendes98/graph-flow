import { NodeTriggerBaseDto } from "./node.trigger.base.dto";
import { DtoProperty } from "../../../../../dtos/dto";
import { IsCron } from "../../../../../validators";

/**
 * DTO for `node-trigger` of subtype CRON
 */
export class NodeTriggerCronDto extends NodeTriggerBaseDto {
	/**
	 * The time the workflow should be executed
	 */
	@DtoProperty()
	@IsCron()
	public cron!: string;
}
