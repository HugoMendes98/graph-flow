export enum NodeIoType {
	ANY = "any",
	JSON = "json",
	NUMBER = "number",
	STRING = "string",
	VOID = "void"
}

export type NodeIoTypes = Record<string, unknown> | number | string | null;
