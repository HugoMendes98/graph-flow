import { Entity } from "@mikro-orm/core";
import { NodeBehaviorCodeDto as DTO, NodeBehaviorType } from "~/app/common/dtos/node/behaviors";

import { NodeBehaviorBase } from "./node-behavior.base";

const type = NodeBehaviorType.CODE;

@Entity({ discriminatorValue: type })
export class NodeBehaviorCode extends NodeBehaviorBase<typeof type> implements DTO {}
