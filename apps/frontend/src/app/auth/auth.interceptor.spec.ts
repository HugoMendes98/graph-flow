import { TestBed } from "@angular/core/testing";
import { ApiModule } from "~/lib/ng/lib/api";

import { AuthInterceptor } from "./auth.interceptor";
import { AuthModule } from "./auth.module";

describe("AuthInterceptor", () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			imports: [ApiModule.forRoot({ client: { url: "" } }), AuthModule]
		})
	);

	it("should be created", () => {
		const interceptor: AuthInterceptor = TestBed.inject(AuthInterceptor);
		expect(interceptor).toBeTruthy();
	});
});
