import { MockSeed } from "./mock.seed";
import { NodeBehaviorType } from "../app/node/dtos/behaviors/node-behavior.type";
import { NodeTriggerType } from "../app/node/dtos/behaviors/triggers";
import { NodeKindType } from "../app/node/dtos/kind/node-kind.type";
import { NodeIoType } from "../app/node/io";

/** Sample date1 */
const date1 = new Date(2020, 1, 1);

/**
 * A seed which main focus is the nodes.
 * All nodes have (when possible) 1 input and 1 output.
 */
export const ONLY_NODES_SEED = {
	categories: [],
	graph: {
		arcs: [],
		graphs: [
			{
				// node-function
				_id: 1,

				_created_at: date1,
				_updated_at: date1
			}
		],
		nodes: [
			{
				_id: 1,

				_created_at: date1,
				_updated_at: date1,

				__categories: [],

				behavior: { type: NodeBehaviorType.VARIABLE, value: 0 },
				kind: { active: false, type: NodeKindType.TEMPLATE },
				name: "VARIABLE",

				inputs: [
					{
						_id: 1,

						_created_at: date1,
						_updated_at: date1,

						__node: 1,
						__ref: null,
						name: "",
						type: NodeIoType.VOID
					}
				],
				outputs: [
					{
						_id: 1,

						_created_at: date1,
						_updated_at: date1,

						__node: 1,
						__ref: null,
						name: "",
						type: NodeIoType.ANY
					}
				]
			},
			{
				_id: 2,

				_created_at: date1,
				_updated_at: date1,

				__categories: [],

				behavior: { code: "", type: NodeBehaviorType.CODE },
				kind: { active: false, type: NodeKindType.TEMPLATE },
				name: "CODE",

				inputs: [
					{
						_id: 2,

						_created_at: date1,
						_updated_at: date1,

						__node: 2,
						__ref: null,
						name: "",
						type: NodeIoType.VOID
					}
				],
				outputs: [
					{
						_id: 2,

						_created_at: date1,
						_updated_at: date1,

						__node: 2,
						__ref: null,
						name: "",
						type: NodeIoType.ANY
					}
				]
			},
			{
				_id: 3,

				_created_at: date1,
				_updated_at: date1,

				__categories: [],

				behavior: {
					trigger: { cron: "* * * * *", type: NodeTriggerType.CRON },
					type: NodeBehaviorType.TRIGGER
				},
				kind: { active: false, type: NodeKindType.TEMPLATE },
				name: "TRIGGER",

				inputs: [],
				outputs: [
					{
						_id: 3,

						_created_at: date1,
						_updated_at: date1,

						__node: 3,
						__ref: null,
						name: "",
						type: NodeIoType.NUMBER
					}
				]
			},
			{
				_id: 4,

				_created_at: date1,
				_updated_at: date1,

				__categories: [],

				behavior: { __graph: 1, type: NodeBehaviorType.FUNCTION },
				kind: { active: false, type: NodeKindType.TEMPLATE },
				name: "FUNCTION",

				inputs: [
					{
						_id: 4,

						_created_at: date1,
						_updated_at: date1,

						__node: 4,
						__ref: null,
						name: "PARAMETER_IN",
						type: NodeIoType.ANY
					}
				],
				outputs: [
					{
						_id: 4,

						_created_at: date1,
						_updated_at: date1,

						__node: 4,
						__ref: null,
						name: "PARAMETER_OUT",
						type: NodeIoType.ANY
					}
				]
			},
			{
				_id: 5,

				_created_at: date1,
				_updated_at: date1,

				__categories: [],

				behavior: { __node_input: 4, type: NodeBehaviorType.PARAMETER_IN },
				kind: { __graph: 1, position: { x: 0, y: 0 }, type: NodeKindType.VERTEX },
				name: "PARAMETER_IN",

				inputs: [],
				outputs: [
					{
						_id: 5,

						_created_at: date1,
						_updated_at: date1,

						__node: 5,
						__ref: null,
						name: "PARAMETER_IN",
						type: NodeIoType.ANY
					}
				]
			},
			{
				_id: 6,

				_created_at: date1,
				_updated_at: date1,

				__categories: [],

				behavior: { __node_output: 4, type: NodeBehaviorType.PARAMETER_OUT },
				kind: { __graph: 1, position: { x: 0, y: 0 }, type: NodeKindType.VERTEX },
				name: "PARAMETER_OUT",

				inputs: [
					{
						_id: 6,

						_created_at: date1,
						_updated_at: date1,

						__node: 6,
						__ref: null,
						name: "PARAMETER_OUT",
						type: NodeIoType.ANY
					}
				],
				outputs: []
			},
			{
				_id: 7,

				_created_at: date1,
				_updated_at: date1,

				__categories: [],

				behavior: { __node: 2, type: NodeBehaviorType.REFERENCE },
				kind: { __graph: 1, position: { x: 0, y: 0 }, type: NodeKindType.VERTEX },
				name: "REFERENCE",

				inputs: [
					{
						_id: 7,

						_created_at: date1,
						_updated_at: date1,

						__node: 7,
						__ref: 2,
						name: "",
						type: NodeIoType.VOID
					}
				],
				outputs: [
					{
						_id: 7,

						_created_at: date1,
						_updated_at: date1,

						__node: 7,
						__ref: 2,
						name: "",
						type: NodeIoType.ANY
					}
				]
			}
		]
	},
	users: [
		// In case
		{
			_id: 1,

			_created_at: date1,
			_updated_at: date1,

			email: "admin@host.local",
			password: "password",

			firstname: null,
			lastname: null
		}
	],
	workflows: []
} as const satisfies MockSeed;
