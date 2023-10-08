import { NodeDto } from "../../../node/dtos";
import { NodeKindVertexDto } from "../../../node/dtos/kind";

export type GraphNodeDto = Omit<NodeDto, "kind"> &
	Record<keyof Pick<NodeDto, "kind">, NodeKindVertexDto>;
