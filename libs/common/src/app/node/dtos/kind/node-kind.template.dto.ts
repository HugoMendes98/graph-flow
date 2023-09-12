import { NodeKindBaseDto } from "./node-kind.base.dto";
import { NodeKindType } from "./node-kind.type";

export class NodeKindTemplateDto extends NodeKindBaseDto {
	public override readonly type = NodeKindType.TEMPLATE;
}
