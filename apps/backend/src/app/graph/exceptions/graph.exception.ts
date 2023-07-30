import { GraphErrorCode } from "~/lib/common/app/graph/error-codes";

import { BadLogicException } from "../../_lib/exceptions";

export class GraphException extends BadLogicException {
	public constructor(code: GraphErrorCode, message?: string) {
		super({
			code,
			message
		});
	}
}
