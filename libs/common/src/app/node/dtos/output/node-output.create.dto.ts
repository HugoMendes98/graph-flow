import { PickType } from "@nestjs/mapped-types";

import { NodeOutputDto } from "./node-output.dto";

export class NodeOutputCreateDto extends PickType(NodeOutputDto, ["name", "type"]) {}
