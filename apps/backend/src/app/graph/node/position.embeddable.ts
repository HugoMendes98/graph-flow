import { Embeddable, Property } from "@mikro-orm/core";
import { PositionDto } from "~/app/common/dtos/graph/node";

@Embeddable()
export class PositionEmbeddable implements PositionDto {
	@Property()
	public x!: number;
	@Property()
	public y!: number;
}
