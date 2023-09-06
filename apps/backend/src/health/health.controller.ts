import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { HealthCheck } from "@nestjs/terminus";

import { HealthService } from "./health.service";

// TODO: Probably add a security here (Like unique tokens, whitelisted IPs, ...)

/**
 * Controller giving server health status
 */
@ApiTags("Health")
@Controller("/health")
export class HealthController {
	/**
	 * Constructor with "dependency injection"
	 *
	 * @param service injected
	 */
	public constructor(private readonly service: HealthService) {}

	/**
	 * Checks the status of the server
	 *
	 * @returns the health status
	 */
	@Get()
	@HealthCheck()
	public check() {
		return this.service.check();
	}
}
