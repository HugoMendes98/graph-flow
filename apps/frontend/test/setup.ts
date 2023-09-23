import "jest-preset-angular/setup-jest";
import { TestBed } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { ApiTestingModule } from "~/lib/ng/lib/api/testing";

import { AppTranslationModule } from "../src/lib/translation";

TestBed.configureTestingModule({
	errorOnUnknownElements: true,
	errorOnUnknownProperties: true,
	imports: [ApiTestingModule, AppTranslationModule, NoopAnimationsModule],
	teardown: { destroyAfterEach: true }
});
