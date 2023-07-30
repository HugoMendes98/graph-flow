import { Embeddable, Property } from "@mikro-orm/core";
import { PositionDto } from "~/lib/common/app/graph/dtos/node";

@Embeddable()
export class PositionEmbeddable implements PositionDto {
	@Property()
	public x!: number;
	@Property()
	public y!: number;
}
