import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { HealthCheck } from "@nestjs/terminus";

import { HealthService } from "./health.service";

// TODO: Probably add a security here (Like unique tokens, whitelisted IPs, ...)

@ApiTags("Health")
@Controller("/health")
export class HealthController {
	public constructor(private readonly service: HealthService) {}

	@Get()
	@HealthCheck()
	public check() {
		return this.service.check();
	}
}
