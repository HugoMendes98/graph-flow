import { NodeOutputCreateDto } from "~/lib/common/app/node/dtos/output";

import { NodeOutput } from "./node-output.entity";

export type NodeOutputCreate = NodeOutputCreateDto & Pick<NodeOutput, "__node" | "__ref">;
