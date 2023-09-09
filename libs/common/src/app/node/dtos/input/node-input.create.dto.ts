import { PickType } from "@nestjs/mapped-types";

import { NodeInputDto } from "./node-input.dto";

export class NodeInputCreateDto extends PickType(NodeInputDto, ["name", "type"]) {}
