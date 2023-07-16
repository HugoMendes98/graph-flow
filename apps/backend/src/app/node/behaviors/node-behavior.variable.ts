import { Entity } from "@mikro-orm/core";
import { NodeBehaviorVariableDto as DTO, NodeBehaviorType } from "~/app/common/dtos/node/behaviors";

import { NodeBehaviorBase } from "./node-behavior.base";

const type = NodeBehaviorType.VARIABLE;

@Entity({ discriminatorValue: type })
export class NodeBehaviorVariable extends NodeBehaviorBase<typeof type> implements DTO {}
