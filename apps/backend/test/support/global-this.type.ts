import { Container } from "dockerode";

export interface GlobalThis {
	jest_config: { container: Container | "existing" } | undefined;
}
