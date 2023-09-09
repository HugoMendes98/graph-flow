import { NodeInputCreateDto } from "~/lib/common/app/node/dtos/input";

import { NodeInput } from "./node-input.entity";

export type NodeInputCreate = NodeInputCreateDto & Pick<NodeInput, "__node" | "__ref">;
