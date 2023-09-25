import { AxiosError, HttpStatusCode } from "axios";
import { Jsonify } from "type-fest";
import { DbE2eHelper } from "~/app/backend/e2e/db-e2e/db-e2e.helper";
import { WorkflowHttpClient } from "~/app/backend/e2e/http/clients/workflow.http-client";
import { WorkflowQueryDto } from "~/lib/common/app/workflow/dtos";
import { WORKFLOWS_ENDPOINT_PREFIX } from "~/lib/common/app/workflow/endpoints";
import { BASE_SEED } from "~/lib/common/seeds";

describe("Backend HTTP Graphs", () => {
	const client = new WorkflowHttpClient();

	const dbHelper = DbE2eHelper.getHelper("base");
	const db = JSON.parse(JSON.stringify(dbHelper.db)) as Jsonify<typeof BASE_SEED>;

	beforeAll(async () => {
		const [{ email, password }] = db.users;

		await dbHelper.refresh();
		await client.setAuth(email, password);
	});

	describe(`GET ${WORKFLOWS_ENDPOINT_PREFIX}`, () => {
		beforeAll(() => dbHelper.refresh());

		it("should order by boolean properties", async () => {
			const response = await client
				.findManyResponse({
					params: { order: [{ active: "desc" }] } satisfies WorkflowQueryDto
				})
				.catch(({ response }: AxiosError) => response!);

			expect(response.status).toBe(HttpStatusCode.Ok);
		});
	});
});
