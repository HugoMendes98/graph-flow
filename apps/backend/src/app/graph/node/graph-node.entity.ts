import { Collection, Embedded, Entity, OneToMany, Property } from "@mikro-orm/core";
import { GraphNodeDto } from "~/lib/common/app/graph/dtos/node";
import { EntityId } from "~/lib/common/dtos/entity";
import { DtoToEntity } from "~/lib/common/dtos/entity/entity.types";

import { GraphNodeRepository } from "./graph-node.repository";
import { GraphNodeInput } from "./input/graph-node-input.entity";
import { GraphNodeOutput } from "./output/graph-node-output.entity";
import { PositionEmbeddable } from "./position.embeddable";
import { EntityBase, EntityToDto } from "../../_lib/entity";
import { ManyToOneFactory, ManyToOneParams } from "../../_lib/entity/decorators";
import { Node } from "../../node/node.entity";
import { Graph } from "../graph.entity";

const GraphProperty = ManyToOneFactory(() => Graph, {
	fieldName: "__graph" satisfies keyof GraphNodeDto,
	onUpdateIntegrity: "cascade"
});

const NodeProperty = (params: ManyToOneParams) =>
	ManyToOneFactory(() => Node, {
		eager: params.foreign,
		fieldName: "__node" satisfies keyof GraphNodeDto,
		onUpdateIntegrity: "cascade"
	})(params);

@Entity({ customRepository: () => GraphNodeRepository })
export class GraphNode extends EntityBase implements DtoToEntity<GraphNodeDto> {
	/**
	 * @inheritDoc
	 */
	@GraphProperty({ foreign: false })
	public __graph!: EntityId;

	/**
	 * @inheritDoc
	 */
	@NodeProperty({ foreign: false })
	public __node!: EntityId;

	/**
	 * @inheritDoc
	 */
	@Property()
	public name!: string;

	/**
	 * @inheritDoc
	 */
	@Embedded(() => PositionEmbeddable)
	public position!: PositionEmbeddable;

	// ------- Relations -------

	@OneToMany(() => GraphNodeInput, ({ graphNode }) => graphNode, { eager: true })
	public readonly inputs = new Collection<GraphNodeInput>(this);
	@OneToMany(() => GraphNodeOutput, ({ graphNode }) => graphNode, { eager: true })
	public readonly outputs = new Collection<GraphNodeOutput>(this);

	@NodeProperty({ foreign: true })
	public readonly node!: Node;

	@GraphProperty({ foreign: true })
	public readonly graph?: Graph;

	public override toJSON?(): EntityToDto<this> {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Override only applied if the parent function exists
		const [json, node] = [super.toJSON!(), this.node.toJSON!()];

		// Override the inputs and outputs
		return {
			...json,
			inputs: this.inputs.toJSON(),
			node,
			outputs: this.outputs.toJSON()
		};
	}
}
