// https://github.com/ljharb/qs/issues/270#issuecomment-496173839
declare module "qs/lib/stringify" {
	// eslint-disable-next-line import/no-default-export -- See GH issue
	export { stringify as default } from "qs";
}
