import { Embeddable, Property } from "@mikro-orm/core";
import { PositionDto } from "~/lib/common/dtos/graph/node";

@Embeddable()
export class PositionEmbeddable implements PositionDto {
	@Property()
	public x!: number;
	@Property()
	public y!: number;
}
