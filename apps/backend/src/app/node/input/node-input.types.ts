import { NodeInputCreateDto } from "~/lib/common/app/node/dtos/input";

import { NodeInputEntity } from "./node-input.entity";

export type NodeInputCreate = NodeInputCreateDto &
	Pick<NodeInputEntity, "__node" | "__ref">;
