import { MockSeed } from "./mock.seed";
import { NodeBehaviorType } from "../app/node/dtos/behaviors";
import { NodeTriggerType } from "../app/node/dtos/behaviors/triggers";

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
		graphArcs: [
			// region - Arcs for Node-function 20 - graph1
			{
				// "Calculate quotient" -> "Quotient"
				_id: 101,

				_created_at: date1,
				_updated_at: date1,

				__from: 100101,
				__to: 100501
			},
			{
				// "Calculate remainder" -> "Remainder"
				_id: 102,

				_created_at: date1,
				_updated_at: date1,

				__from: 100201,
				__to: 100601
			},
			{
				// "Dividend" -> "Calculate quotient"
				_id: 103,

				_created_at: date1,
				_updated_at: date1,

				__from: 100301,
				__to: 100101
			},
			{
				// "Dividend" -> "Calculate remainder"
				_id: 104,

				_created_at: date1,
				_updated_at: date1,

				__from: 100301,
				__to: 100201
			},
			{
				// "Divisor" -> "Calculate quotient"
				_id: 105,

				_created_at: date1,
				_updated_at: date1,

				__from: 100401,
				__to: 100102
			},
			{
				// "Divisor" -> "Calculate remainder"
				_id: 106,

				_created_at: date1,
				_updated_at: date1,

				__from: 100401,
				__to: 100202
			},
			// endregion

			// region - Arcs for workflow 1 - graph2
			{
				// Variable output "DB_HOST" -> Code "SQL Query" input "DB Host"
				_id: 201,

				_created_at: date1,
				_updated_at: date1,

				__from: 200101,
				__to: 200501
			},
			{
				// Variable output "DB_HOST" -> Code "SQL Query" input "DB Host"
				_id: 202,

				_created_at: date1,
				_updated_at: date1,

				__from: 200201,
				__to: 200502
			},
			{
				// Variable output "DB_HOST" -> Code "SQL Query" input "DB Host"
				_id: 203,

				_created_at: date1,
				_updated_at: date1,

				__from: 200301,
				__to: 200503
			},
			{
				// Variable output "DB_HOST" -> Code "SQL Query" input "DB Host"
				_id: 204,

				_created_at: date1,
				_updated_at: date1,

				__from: 200401,
				__to: 200504
			}
			// endregion
		],
		graphNodeInputs: [
			// region - Node outputs for Node-function 20 - graph1
			{
				// "Calculate quotient" dividend input
				_id: 100101,

				_created_at: date1,
				_updated_at: date1,

				__graph_node: 1001,
				__node_input: 1001
			},
			{
				// "Calculate quotient" divisor input
				_id: 100102,

				_created_at: date1,
				_updated_at: date1,

				__graph_node: 1001,
				__node_input: 1002
			},
			{
				// "Calculate remainder" dividend input
				_id: 100201,

				_created_at: date1,
				_updated_at: date1,

				__graph_node: 1002,
				__node_input: 1101
			},
			{
				// "Calculate remainder" divisor input
				_id: 100202,

				_created_at: date1,
				_updated_at: date1,

				__graph_node: 1002,
				__node_input: 1102
			},
			{
				// Parameter output "Quotient"
				_id: 100501,

				_created_at: date1,
				_updated_at: date1,

				__graph_node: 1005,
				__node_input: 200301
			},
			{
				// Parameter output "Remainder"
				_id: 100601,

				_created_at: date1,
				_updated_at: date1,

				__graph_node: 1006,
				__node_input: 200401
			},
			// endregion

			// region - Node inputs for workflow 1 - graph2
			{
				// Variable void input "DB_HOST"
				_id: 200101,

				_created_at: date1,
				_updated_at: date1,

				__graph_node: 2001,
				__node_input: 101
			},
			{
				// Variable void input "DB_PORT"
				_id: 200201,

				_created_at: date1,
				_updated_at: date1,

				__graph_node: 2002,
				__node_input: 201
			},
			{
				// Variable void input "DB_USER"
				_id: 200301,

				_created_at: date1,
				_updated_at: date1,

				__graph_node: 2003,
				__node_input: 301
			},
			{
				// Variable void input "DB_PASS"
				_id: 200401,

				_created_at: date1,
				_updated_at: date1,

				__graph_node: 2004,
				__node_input: 401
			},

			{
				// Input "DB Host" of Code "SQL Query"
				_id: 200501,

				_created_at: date1,
				_updated_at: date1,

				__graph_node: 2005,
				__node_input: 501
			},
			{
				// Input "DB Port" of Code "SQL Query"
				_id: 200502,

				_created_at: date1,
				_updated_at: date1,

				__graph_node: 2005,
				__node_input: 502
			},
			{
				// Input "DB User" of Code "SQL Query"
				_id: 200503,

				_created_at: date1,
				_updated_at: date1,

				__graph_node: 2005,
				__node_input: 503
			},
			{
				// Input "DB Pass" of Code "SQL Query"
				_id: 200504,

				_created_at: date1,
				_updated_at: date1,

				__graph_node: 2005,
				__node_input: 504
			},
			{
				// Input "SQL stmt" of Code "SQL Query"
				_id: 200505,

				_created_at: date1,
				_updated_at: date1,

				__graph_node: 2005,
				__node_input: 505
			}

			// endregion
		],
		graphNodeOutputs: [
			// region - Node outputs for Node-function 20 - graph1
			{
				// "Calculate quotient" output
				_id: 100101,

				_created_at: date1,
				_updated_at: date1,

				__graph_node: 1001,
				__node_output: 1001
			},
			{
				// "Calculate remainder" output
				_id: 100201,

				_created_at: date1,
				_updated_at: date1,

				__graph_node: 1002,
				__node_output: 1101
			},
			{
				// Parameter input "Dividend"
				_id: 100301,

				_created_at: date1,
				_updated_at: date1,

				__graph_node: 1003,
				__node_output: 200101
			},
			{
				// Parameter input "Divisor"
				_id: 100401,

				_created_at: date1,
				_updated_at: date1,

				__graph_node: 1004,
				__node_output: 200201
			},
			// endregion

			// region - Node outputs for workflow 1 - graph2
			{
				// Variable output "DB_HOST"
				_id: 200101,

				_created_at: date1,
				_updated_at: date1,

				__graph_node: 2001,
				__node_output: 101
			},
			{
				// Variable output "DB_PORT"
				_id: 200201,

				_created_at: date1,
				_updated_at: date1,

				__graph_node: 2002,
				__node_output: 201
			},
			{
				// Variable output "DB_USER"
				_id: 200301,

				_created_at: date1,
				_updated_at: date1,

				__graph_node: 2003,
				__node_output: 301
			},
			{
				// Variable output "DB_PASS"
				_id: 200401,

				_created_at: date1,
				_updated_at: date1,

				__graph_node: 2004,
				__node_output: 401
			},

			{
				// Output of "SQL Query"
				_id: 200501,

				_created_at: date1,
				_updated_at: date1,

				__graph_node: 2005,
				__node_output: 501
			}
			// endregion
		],
		graphNodes: [
			// region - Graph 1 (node-function)
			{
				_id: 1001,

				_created_at: date1,
				_updated_at: date1,

				__graph: 1,
				__node: 10,
				name: "Calculate quotient (fn)",
				position: { x: 100, y: 0 }
			},
			{
				_id: 1002,

				_created_at: date1,
				_updated_at: date1,

				__graph: 1,
				__node: 11,
				name: "Calculate remainder (fn)",
				position: { x: 100, y: 200 }
			},
			{
				_id: 1003,

				_created_at: date1,
				_updated_at: date1,

				__graph: 1,
				__node: 2001,
				name: "Dividend (input)",
				position: { x: 0, y: 75 }
			},
			{
				_id: 1004,

				_created_at: date1,
				_updated_at: date1,

				__graph: 1,
				__node: 2002,
				name: "Divisor (input)",
				position: { x: 0, y: 150 }
			},
			{
				_id: 1005,

				_created_at: date1,
				_updated_at: date1,

				__graph: 1,
				__node: 2003,
				name: "Quotient (output)",
				position: { x: 300, y: 75 }
			},
			{
				_id: 1006,

				_created_at: date1,
				_updated_at: date1,

				__graph: 1,
				__node: 2004,
				name: "Remainder (input)",
				position: { x: 3000, y: 150 }
			},

			// endregion:

			// region - Workflow 1
			{
				_id: 2001,

				_created_at: date1,
				_updated_at: date1,

				__graph: 2,
				__node: 1,
				name: "DB_HOST",
				position: { x: 0, y: 0 }
			},
			{
				_id: 2002,

				_created_at: date1,
				_updated_at: date1,

				__graph: 2,
				__node: 2,
				name: "DB_PORT",
				position: { x: 0, y: 50 }
			},
			{
				_id: 2003,

				_created_at: date1,
				_updated_at: date1,

				__graph: 2,
				__node: 3,
				name: "DB_USER",
				position: { x: 0, y: 100 }
			},
			{
				_id: 2004,

				_created_at: date1,
				_updated_at: date1,

				__graph: 2,
				__node: 4,
				name: "DB_PASS",
				position: { x: 0, y: 150 }
			},

			{
				_id: 2005,

				_created_at: date1,
				_updated_at: date1,

				__graph: 2,
				__node: 5,
				name: "Make SQL query",
				position: { x: 150, y: 80 }
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
			}
		]
	},
	node: {
		nodeInputs: [
			// region Variables dummy inputs
			{
				_id: 101,

				_created_at: date1,
				_updated_at: date1,

				__node: 1,
				name: "DB_HOST in"
			},
			{
				_id: 201,

				_created_at: date1,
				_updated_at: date1,

				__node: 2,
				name: "DB_PORT in"
			},
			{
				_id: 301,

				_created_at: date1,
				_updated_at: date1,

				__node: 3,
				name: "DB_USER in"
			},
			{
				_id: 401,

				_created_at: date1,
				_updated_at: date1,

				__node: 4,
				name: "DB_PASS in"
			},
			// endregion

			// region inputs for code 5 (SQL request)
			{
				_id: 501,

				_created_at: date1,
				_updated_at: date1,

				__node: 5,
				name: "DB Host"
			},
			{
				_id: 502,

				_created_at: date1,
				_updated_at: date1,

				__node: 5,
				name: "DB Port"
			},
			{
				_id: 503,

				_created_at: date1,
				_updated_at: date1,

				__node: 5,
				name: "DB User"
			},
			{
				_id: 504,

				_created_at: date1,
				_updated_at: date1,

				__node: 5,
				name: "DB Pass"
			},
			{
				_id: 505,

				_created_at: date1,
				_updated_at: date1,

				__node: 5,
				name: "SQL stmt"
			},

			// endregion

			// Inputs for code 10
			{
				_id: 1001,

				_created_at: date1,
				_updated_at: date1,

				__node: 10,
				name: "Dividend"
			},
			{
				_id: 1002,

				_created_at: date1,
				_updated_at: date1,

				__node: 10,
				name: "Divisor"
			},

			// Inputs for code 11
			{
				_id: 1101,

				_created_at: date1,
				_updated_at: date1,

				__node: 11,
				name: "Dividend"
			},
			{
				_id: 1102,

				_created_at: date1,
				_updated_at: date1,

				__node: 11,
				name: "Divisor"
			},

			// ----------------------------------------------------------

			// In parameters for function 20
			{
				_id: 2001,

				_created_at: date1,
				_updated_at: date1,

				__node: 20,
				name: "Dividend"
			},
			{
				_id: 2002,

				_created_at: date1,
				_updated_at: date1,

				__node: 20,
				name: "Divisor"
			},
			{
				_id: 200301,

				_created_at: date1,
				_updated_at: date1,

				__node: 2003,
				name: "Quotient (input of the output parameter node)"
			},
			{
				_id: 200401,

				_created_at: date1,
				_updated_at: date1,

				__node: 2004,
				name: "Remainder (input of the output parameter node)"
			}
		],
		nodeOutputs: [
			// Variables outputs
			{
				_id: 101,

				_created_at: date1,
				_updated_at: date1,

				__node: 1,
				name: "DB_HOST out"
			},
			{
				_id: 201,

				_created_at: date1,
				_updated_at: date1,

				__node: 2,
				name: "DB_PORT out"
			},
			{
				_id: 301,

				_created_at: date1,
				_updated_at: date1,

				__node: 3,
				name: "DB_USER out"
			},
			{
				_id: 401,

				_created_at: date1,
				_updated_at: date1,

				__node: 4,
				name: "DB_PASS out"
			},

			{
				// Output for code 10 (SQL request)
				_id: 501,

				_created_at: date1,
				_updated_at: date1,

				__node: 5,
				name: "SQL Output"
			},

			{
				// Output for code 10
				_id: 1001,

				_created_at: date1,
				_updated_at: date1,

				__node: 10,
				name: "Quotient"
			},
			{
				// Output for code 11
				_id: 1101,

				_created_at: date1,
				_updated_at: date1,

				__node: 11,
				name: "Remainder"
			},

			// ----------------------------------------------------------

			// Out parameter for function 20
			{
				_id: 2003,

				_created_at: date1,
				_updated_at: date1,

				__node: 20,
				name: "Quotient"
			},
			{
				_id: 2004,

				_created_at: date1,
				_updated_at: date1,

				__node: 20,
				name: "Remainder"
			},
			{
				_id: 200101,

				_created_at: date1,
				_updated_at: date1,

				__node: 2001,
				name: "Dividend (output of the input parameter node)"
			},
			{
				_id: 200201,

				_created_at: date1,
				_updated_at: date1,

				__node: 2002,
				name: "Divisor (output of the input parameter node)"
			}
		],
		nodes: [
			// Some DB variables
			{
				_id: 1,

				_created_at: date1,
				_updated_at: date1,

				__categories: [1],

				behavior: { type: NodeBehaviorType.VARIABLE },
				name: "DB_HOST"
			},
			{
				_id: 2,

				_created_at: date1,
				_updated_at: date1,

				__categories: [1],

				behavior: { type: NodeBehaviorType.VARIABLE },
				name: "DB_PORT"
			},
			{
				_id: 3,

				_created_at: date1,
				_updated_at: date1,

				__categories: [1],

				behavior: { type: NodeBehaviorType.VARIABLE },
				name: "DB_USER"
			},
			{
				_id: 4,

				_created_at: date1,
				_updated_at: date1,

				__categories: [1],

				behavior: { type: NodeBehaviorType.VARIABLE },
				name: "DB_PASS"
			},

			// ----------------------------------------------------------

			// Some codes
			{
				_id: 5,

				_created_at: date1,
				_updated_at: date1,

				__categories: [1, 2],

				behavior: { type: NodeBehaviorType.CODE },
				name: "Make SQL query"
			},
			{
				// Do: Math.floor(a / b)
				_id: 10,

				_created_at: date1,
				_updated_at: date1,

				__categories: [2],

				behavior: { type: NodeBehaviorType.CODE },
				name: "Calculate quotient"
			},
			{
				// Do: a % b
				_id: 11,

				_created_at: date1,
				_updated_at: date1,

				__categories: [2],

				behavior: { type: NodeBehaviorType.CODE },
				name: "Calculate remainder"
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
				name: "Integer division"
			}, // parameters start with id 20
			{
				_id: 2001,

				_created_at: date1,
				_updated_at: date1,

				__categories: [],

				behavior: { __node_input: 2001, type: NodeBehaviorType.PARAMETER_IN },
				name: "Dividend"
			},
			{
				_id: 2002,

				_created_at: date1,
				_updated_at: date1,

				__categories: [],

				behavior: { __node_input: 2002, type: NodeBehaviorType.PARAMETER_IN },
				name: "Divisor"
			},
			{
				_id: 2003,

				_created_at: date1,
				_updated_at: date1,

				__categories: [],

				behavior: { __node_output: 2003, type: NodeBehaviorType.PARAMETER_OUT },
				name: "Quotient"
			},
			{
				_id: 2004,

				_created_at: date1,
				_updated_at: date1,

				__categories: [],

				behavior: { __node_output: 2004, type: NodeBehaviorType.PARAMETER_OUT },
				name: "Remainder"
			},

			// ----------------------------------------------------------

			// Some triggers
			{
				_id: 30,

				_created_at: date1,
				_updated_at: date1,

				__categories: [],

				behavior: {
					trigger: { type: NodeTriggerType.CRON },
					type: NodeBehaviorType.TRIGGER
				},
				name: "Cron"
			}
		]
	},
	users: [
		{
			_id: 1,

			_created_at: date1,
			_updated_at: date1,

			email: "admin@host.local",
			firstname: null,
			lastname: null
		},
		{
			_id: 2,

			_created_at: date1,
			_updated_at: date1,

			email: "john.doe@host.local",
			firstname: "John",
			lastname: "Doe"
		},
		{
			_id: 3,

			_created_at: date1,
			_updated_at: date1,

			email: "jane.doe@host.local",
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
			name: "Do a SQL request"
		},
		{
			_id: 2,

			_created_at: date1,
			_updated_at: date1,

			__graph: 3,
			name: "Empty graph"
		}
	]
} as const satisfies MockSeed;
