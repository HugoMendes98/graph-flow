import { MockSeed } from "./mock.seed";
import { NodeBehaviorType } from "../app/node/dtos/behaviors/node-behavior.type";
import { NodeTriggerType } from "../app/node/dtos/behaviors/triggers";
import { NodeKindType } from "../app/node/dtos/kind/node-kind.type";
import { NodeIoType } from "../app/node/io";

/** Sample date1 */
const date1 = new Date(2020, 1, 1);

/**
 * The base sample for Seeding the DB.
 */
export const BASE_SEED = {
	categories: [
		{
			_id: 1,

			_created_at: date1,
			_updated_at: date1,

			name: "DB"
		},
		{
			_id: 2,

			_created_at: date1,
			_updated_at: date1,

			name: "Math"
		}
	],
	graph: {
		arcs: [
			// region - Arcs for Node-function 20 - graph1
			{
				// "Calculate quotient" -> "Quotient"
				_id: 101,

				_created_at: date1,
				_updated_at: date1,

				__from: 1501,
				__to: 200301
			},
			{
				// "Calculate remainder" -> "Remainder"
				_id: 102,

				_created_at: date1,
				_updated_at: date1,

				__from: 1601,
				__to: 200401
			},
			{
				// "Dividend" -> "Calculate quotient"
				_id: 103,

				_created_at: date1,
				_updated_at: date1,

				__from: 200101,
				__to: 1501
			},
			{
				// "Dividend" -> "Calculate remainder"
				_id: 104,

				_created_at: date1,
				_updated_at: date1,

				__from: 200101,
				__to: 1601
			},
			{
				// "Divisor" -> "Calculate quotient"
				_id: 105,

				_created_at: date1,
				_updated_at: date1,

				__from: 200201,
				__to: 1502
			},
			{
				// "Divisor" -> "Calculate remainder"
				_id: 106,

				_created_at: date1,
				_updated_at: date1,

				__from: 200201,
				__to: 1602
			},
			// endregion

			// region - Arcs for workflow 1 - graph2
			{
				// Variable output "DB_HOST" -> Code "SQL Query" input "DB Host"
				_id: 201,

				_created_at: date1,
				_updated_at: date1,

				__from: 101,
				__to: 501
			},
			{
				// Variable output "DB_PORT" -> Code "SQL Query" input "DB PORT"
				_id: 202,

				_created_at: date1,
				_updated_at: date1,

				__from: 201,
				__to: 502
			},
			{
				// Variable output "DB_USER" -> Code "SQL Query" input "DB USER"
				_id: 203,

				_created_at: date1,
				_updated_at: date1,

				__from: 301,
				__to: 503
			},
			{
				// Variable output "DB_PASS" -> Code "SQL Query" input "DB DB PASS"
				_id: 204,

				_created_at: date1,
				_updated_at: date1,

				__from: 401,
				__to: 504
			}
			// endregion
		],
		graphs: [
			{
				// node-function 20
				_id: 1,

				_created_at: date1,
				_updated_at: date1
			},
			{
				// workflow 1
				_id: 2,

				_created_at: date1,
				_updated_at: date1
			},
			{
				// empty workflow 2
				_id: 3,

				_created_at: date1,
				_updated_at: date1
			},
			{
				// empty workflow 3
				_id: 4,

				_created_at: date1,
				_updated_at: date1
			}
		],
		nodes: [
			// Some DB variables
			{
				_id: 1,

				_created_at: date1,
				_updated_at: date1,

				__categories: [1],

				behavior: { type: NodeBehaviorType.VARIABLE, value: "host" },
				kind: {
					__graph: 2,
					position: { x: 25, y: 25 },
					type: NodeKindType.VERTEX
				},
				name: "DB_HOST",

				inputs: [
					{
						_id: 101,

						_created_at: date1,
						_updated_at: date1,

						__node: 1,
						__ref: null,
						name: "DB_HOST in",
						type: NodeIoType.VOID
					}
				],
				outputs: [
					{
						_id: 101,

						_created_at: date1,
						_updated_at: date1,

						__node: 1,
						__ref: null,
						name: "DB_HOST out",
						type: NodeIoType.STRING
					}
				]
			},
			{
				_id: 2,

				_created_at: date1,
				_updated_at: date1,

				__categories: [1],

				behavior: { type: NodeBehaviorType.VARIABLE, value: 1234 },
				kind: {
					__graph: 2,
					position: { x: 25, y: 150 },
					type: NodeKindType.VERTEX
				},
				name: "DB_PORT",

				inputs: [
					{
						_id: 201,

						_created_at: date1,
						_updated_at: date1,

						__node: 2,
						__ref: null,
						name: "DB_PORT in",
						type: NodeIoType.VOID
					}
				],
				outputs: [
					{
						_id: 201,

						_created_at: date1,
						_updated_at: date1,

						__node: 2,
						__ref: null,
						name: "DB_PORT out",
						type: NodeIoType.NUMBER
					}
				]
			},
			{
				_id: 3,

				_created_at: date1,
				_updated_at: date1,

				__categories: [1],

				behavior: { type: NodeBehaviorType.VARIABLE, value: "user" },
				kind: {
					__graph: 2,
					position: { x: 25, y: 275 },
					type: NodeKindType.VERTEX
				},
				name: "DB_USER",

				inputs: [
					{
						_id: 301,

						_created_at: date1,
						_updated_at: date1,

						__node: 3,
						__ref: null,
						name: "DB_USER in",
						type: NodeIoType.VOID
					}
				],
				outputs: [
					{
						_id: 301,

						_created_at: date1,
						_updated_at: date1,

						__node: 3,
						__ref: null,
						name: "DB_USER out",
						type: NodeIoType.STRING
					}
				]
			},
			{
				_id: 4,

				_created_at: date1,
				_updated_at: date1,

				__categories: [1],

				behavior: { type: NodeBehaviorType.VARIABLE, value: "pass" },
				kind: {
					__graph: 2,
					position: { x: 25, y: 400 },
					type: NodeKindType.VERTEX
				},
				name: "DB_PASS",

				inputs: [
					{
						_id: 401,

						_created_at: date1,
						_updated_at: date1,

						__node: 4,
						__ref: null,
						name: "DB_PASS in",
						type: NodeIoType.VOID
					}
				],
				outputs: [
					{
						_id: 401,

						_created_at: date1,
						_updated_at: date1,

						__node: 4,
						__ref: null,
						name: "DB_PASS out",
						type: NodeIoType.STRING
					}
				]
			},

			// ----------------------------------------------------------

			// Some codes
			{
				_id: 5,

				_created_at: date1,
				_updated_at: date1,

				__categories: [1, 2],

				behavior: {
					code: "module.export = console.log",
					type: NodeBehaviorType.CODE
				},
				kind: {
					__graph: 2,
					position: { x: 600, y: 250 },
					type: NodeKindType.VERTEX
				},
				name: "Make SQL query",

				inputs: [
					{
						_id: 501,

						_created_at: date1,
						_updated_at: date1,

						__node: 5,
						__ref: null,
						name: "DB Host",
						type: NodeIoType.STRING
					},
					{
						_id: 502,

						_created_at: date1,
						_updated_at: date1,

						__node: 5,
						__ref: null,
						name: "DB Port",
						type: NodeIoType.STRING
					},
					{
						_id: 503,

						_created_at: date1,
						_updated_at: date1,

						__node: 5,
						__ref: null,
						name: "DB User",
						type: NodeIoType.STRING
					},
					{
						_id: 504,

						_created_at: date1,
						_updated_at: date1,

						__node: 5,
						__ref: null,
						name: "DB Pass",
						type: NodeIoType.STRING
					},
					{
						_id: 505,

						_created_at: date1,
						_updated_at: date1,

						__node: 5,
						__ref: null,
						name: "SQL stmt",
						type: NodeIoType.STRING
					}
				],
				outputs: [
					{
						// Output for code 10 (SQL request)
						_id: 501,

						_created_at: date1,
						_updated_at: date1,

						__node: 5,
						__ref: null,
						name: "SQL Output",
						type: NodeIoType.STRING
					}
				]
			},
			{
				// Do: Math.floor(a / b)
				_id: 10,

				_created_at: date1,
				_updated_at: date1,

				__categories: [2],

				behavior: {
					code: "module.export = (a, b) => b === 0 ? 0 : Math.floor(a / b);",
					type: NodeBehaviorType.CODE
				},
				kind: { active: true, type: NodeKindType.TEMPLATE },
				name: "Calculate quotient",

				inputs: [
					{
						_id: 1001,

						_created_at: date1,
						_updated_at: date1,

						__node: 10,
						__ref: null,
						name: "Dividend",
						type: NodeIoType.NUMBER
					},
					{
						_id: 1002,

						_created_at: date1,
						_updated_at: date1,

						__node: 10,
						__ref: null,
						name: "Divisor",
						type: NodeIoType.NUMBER
					}
				],
				outputs: [
					{
						// Output for code 10
						_id: 1001,

						_created_at: date1,
						_updated_at: date1,

						__node: 10,
						__ref: null,
						name: "Quotient",
						type: NodeIoType.NUMBER
					}
				]
			},
			{
				// Do: a % b
				_id: 11,

				_created_at: date1,
				_updated_at: date1,

				__categories: [2],

				behavior: {
					code: "module.export = (a, b) => b === 0 ? a : a % b;",
					type: NodeBehaviorType.CODE
				},
				kind: { active: true, type: NodeKindType.TEMPLATE },
				name: "Calculate remainder",

				inputs: [
					{
						_id: 1101,

						_created_at: date1,
						_updated_at: date1,

						__node: 11,
						__ref: null,
						name: "Dividend",
						type: NodeIoType.NUMBER
					},
					{
						_id: 1102,

						_created_at: date1,
						_updated_at: date1,

						__node: 11,
						__ref: null,
						name: "Divisor",
						type: NodeIoType.NUMBER
					}
				],
				outputs: [
					{
						// Output for code 11
						_id: 1101,

						_created_at: date1,
						_updated_at: date1,

						__node: 11,
						__ref: null,
						name: "Remainder",
						type: NodeIoType.NUMBER
					}
				]
			},

			// ----------------------------------------------------------

			// Some functions (and parameters)
			{
				// Calculate quotient and remainder
				_id: 20,

				_created_at: date1,
				_updated_at: date1,

				__categories: [2],

				behavior: { __graph: 1, type: NodeBehaviorType.FUNCTION },
				kind: { active: true, type: NodeKindType.TEMPLATE },
				name: "Integer division",

				inputs: [
					{
						_id: 2001,

						_created_at: date1,
						_updated_at: date1,

						__node: 20,
						__ref: null,
						name: "Dividend",
						type: NodeIoType.NUMBER
					},
					{
						_id: 2002,

						_created_at: date1,
						_updated_at: date1,

						__node: 20,
						__ref: null,
						name: "Divisor",
						type: NodeIoType.NUMBER
					}
				],
				outputs: [
					{
						_id: 2003,

						_created_at: date1,
						_updated_at: date1,

						__node: 20,
						__ref: null,
						name: "Quotient",
						type: NodeIoType.NUMBER
					},
					{
						_id: 2004,

						_created_at: date1,
						_updated_at: date1,

						__node: 20,
						__ref: null,
						name: "Remainder",
						type: NodeIoType.NUMBER
					}
				]
			}, // parameters start with id 20
			{
				_id: 2001,

				_created_at: date1,
				_updated_at: date1,

				__categories: [],

				behavior: {
					__node_input: 2001,
					type: NodeBehaviorType.PARAMETER_IN
				},
				kind: {
					__graph: 1,
					position: { x: 25, y: 125 },
					type: NodeKindType.VERTEX
				},
				name: "Dividend",

				inputs: [],
				outputs: [
					{
						_id: 200101,

						_created_at: date1,
						_updated_at: date1,

						__node: 2001,
						__ref: null,
						name: "Dividend (output of the input parameter node)",
						type: NodeIoType.NUMBER
					}
				]
			},
			{
				_id: 2002,

				_created_at: date1,
				_updated_at: date1,

				__categories: [],

				behavior: {
					__node_input: 2002,
					type: NodeBehaviorType.PARAMETER_IN
				},
				kind: {
					__graph: 1,
					position: { x: 25, y: 250 },
					type: NodeKindType.VERTEX
				},
				name: "Divisor",

				inputs: [],
				outputs: [
					{
						_id: 200201,

						_created_at: date1,
						_updated_at: date1,

						__node: 2002,
						__ref: null,
						name: "Divisor (output of the input parameter node)",
						type: NodeIoType.NUMBER
					}
				]
			},
			{
				_id: 2003,

				_created_at: date1,
				_updated_at: date1,

				__categories: [],

				behavior: {
					__node_output: 2003,
					type: NodeBehaviorType.PARAMETER_OUT
				},
				kind: {
					__graph: 1,
					position: { x: 725, y: 125 },
					type: NodeKindType.VERTEX
				},
				name: "Quotient",

				inputs: [
					{
						_id: 200301,

						_created_at: date1,
						_updated_at: date1,

						__node: 2003,
						__ref: null,
						name: "Quotient (input of the output parameter node)",
						type: NodeIoType.NUMBER
					}
				],
				outputs: []
			},
			{
				_id: 2004,

				_created_at: date1,
				_updated_at: date1,

				__categories: [],

				behavior: {
					__node_output: 2004,
					type: NodeBehaviorType.PARAMETER_OUT
				},
				kind: {
					__graph: 1,
					position: { x: 725, y: 250 },
					type: NodeKindType.VERTEX
				},
				name: "Remainder",

				inputs: [
					{
						_id: 200401,

						_created_at: date1,
						_updated_at: date1,

						__node: 2004,
						__ref: null,
						name: "Remainder (input of the output parameter node)",
						type: NodeIoType.NUMBER
					}
				],
				outputs: []
			},

			// ----------------------------------------------------------

			// Some triggers
			{
				_id: 30,

				_created_at: date1,
				_updated_at: date1,

				__categories: [],

				behavior: {
					trigger: { cron: "1 * * * *", type: NodeTriggerType.CRON },
					type: NodeBehaviorType.TRIGGER
				},
				kind: {
					__graph: 2,
					position: { x: 50, y: 650 },
					type: NodeKindType.VERTEX
				},
				name: "Cron",

				inputs: [],
				outputs: [
					{
						_id: 3001,

						_created_at: date1,
						_updated_at: date1,

						__node: 30,
						__ref: null,
						name: "Timestamp",
						type: NodeIoType.NUMBER
					}
				]
			},

			// Node from templates
			{
				// Do: Math.floor(a / b)
				_id: 15,

				_created_at: date1,
				_updated_at: date1,

				__categories: [2],

				behavior: { __node: 10, type: NodeBehaviorType.REFERENCE },
				kind: {
					__graph: 1,
					position: { x: 325, y: 25 },
					type: NodeKindType.VERTEX
				},
				name: "Calculate quotient (reference)",

				inputs: [
					{
						_id: 1501,

						_created_at: date1,
						_updated_at: date1,

						__node: 15,
						__ref: 1001,
						name: "Dividend",
						type: NodeIoType.NUMBER
					},
					{
						_id: 1502,

						_created_at: date1,
						_updated_at: date1,

						__node: 15,
						__ref: 1002,
						name: "Divisor",
						type: NodeIoType.NUMBER
					}
				],
				outputs: [
					{
						// Output for code 10
						_id: 1501,

						_created_at: date1,
						_updated_at: date1,

						__node: 15,
						__ref: 1001,
						name: "Quotient",
						type: NodeIoType.NUMBER
					}
				]
			},
			{
				// Do: a % b
				_id: 16,

				_created_at: date1,
				_updated_at: date1,

				__categories: [2],

				behavior: { __node: 11, type: NodeBehaviorType.REFERENCE },
				kind: {
					__graph: 1,
					position: { x: 325, y: 250 },
					type: NodeKindType.VERTEX
				},
				name: "Calculate remainder (reference)",

				inputs: [
					{
						_id: 1601,

						_created_at: date1,
						_updated_at: date1,

						__node: 16,
						__ref: 1101,
						name: "Dividend",
						type: NodeIoType.NUMBER
					},
					{
						_id: 1602,

						_created_at: date1,
						_updated_at: date1,

						__node: 16,
						__ref: 1102,
						name: "Divisor",
						type: NodeIoType.NUMBER
					}
				],
				outputs: [
					{
						// Output for code 11
						_id: 1601,

						_created_at: date1,
						_updated_at: date1,

						__node: 16,
						__ref: 1101,
						name: "Remainder",
						type: NodeIoType.NUMBER
					}
				]
			}
		]
	},
	users: [
		{
			_id: 1,

			_created_at: date1,
			_updated_at: date1,

			email: "admin@host.local",
			password: "password",

			firstname: null,
			lastname: null
		},
		{
			_id: 2,

			_created_at: date1,
			_updated_at: date1,

			email: "john.doe@host.local",
			password: "password",

			firstname: "John",
			lastname: "Doe"
		},
		{
			_id: 3,

			_created_at: date1,
			_updated_at: date1,

			email: "jane.doe@host.local",
			password: "password",

			firstname: "Jane",
			lastname: "Doe"
		}
	],
	workflows: [
		{
			_id: 1,

			_created_at: date1,
			_updated_at: date1,

			__graph: 2,
			active: false,
			name: "Do a SQL request"
		},
		{
			_id: 2,

			_created_at: date1,
			_updated_at: date1,

			__graph: 3,
			active: false,
			name: "Empty graph"
		},
		{
			_id: 3,

			_created_at: date1,
			_updated_at: date1,

			__graph: 4,
			active: false,
			name: "Empty graph 2"
		}
	]
} as const satisfies MockSeed;
