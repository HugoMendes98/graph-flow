import "jest-preset-angular/setup-jest";
import { TestBed } from "@angular/core/testing";
import { ApiTestingModule } from "~/lib/ng/lib/api/testing";

import { AppTranslationModule } from "../src/lib/translation";

TestBed.configureTestingModule({
	errorOnUnknownElements: true,
	errorOnUnknownProperties: true,
	imports: [ApiTestingModule, AppTranslationModule],
	teardown: { destroyAfterEach: true }
});
