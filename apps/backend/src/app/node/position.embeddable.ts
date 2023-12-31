import { Embeddable, Property } from "@mikro-orm/core";
import { PositionDto } from "~/lib/common/app/node/dtos/position.dto";

@Embeddable()
export class PositionEmbeddable implements PositionDto {
	/** @inheritDoc */
	@Property()
	public x!: number;
	/** @inheritDoc */
	@Property()
	public y!: number;
}
