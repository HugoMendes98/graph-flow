import { Injectable } from "@nestjs/common";
import {
	HealthCheckResult,
	HealthCheckService,
	MemoryHealthIndicator,
	MikroOrmHealthIndicator
} from "@nestjs/terminus";

/**
 * Service for health checks
 */
@Injectable()
export class HealthService {
	/**
	 * The different thresholds for this service
	 */
	private readonly THRESHOLDS = {
		MEMORY: {
			// TODO: from configuration ?
			/**
			 * Heap memory (dynamic) used by the app (in bytes)
			 */
			HEAP: 128 * 1024 * 1024, // => 128MB
			/**
			 * RSS memory used by the app (in bytes) (it includes libs + stack + heap).
			 */
			RSS: 512 * 1024 * 1024 // => 512MB
		}
	} as const;

	/**
	 * Constructor with "dependency injection"
	 *
	 * @param heath injected
	 * @param db injected
	 * @param memory injected
	 */
	public constructor(
		private readonly heath: HealthCheckService,
		private readonly db: MikroOrmHealthIndicator,
		private readonly memory: MemoryHealthIndicator
	) {}

	/**
	 * Checks some resources.
	 *
	 * @returns the results of the check
	 */
	public check(): Promise<HealthCheckResult> {
		return this.heath.check([
			() => this.db.pingCheck("database"),
			() =>
				this.memory.checkHeap(
					"memory_heap",
					this.THRESHOLDS.MEMORY.HEAP
				),
			() => this.memory.checkRSS("memory_rss", this.THRESHOLDS.MEMORY.RSS)
		]);
	}
}
