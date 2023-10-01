import { NodeOutputCreateDto } from "~/lib/common/app/node/dtos/output";

import { NodeOutputEntity } from "./node-output.entity";

export type NodeOutputCreate = NodeOutputCreateDto &
	Pick<NodeOutputEntity, "__node" | "__ref" | "name" | "type">;
