import "jest-preset-angular/setup-jest";
import { TestBed } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { TranslateTestingModule } from "ngx-translate-testing";

import { ApiTestingModule } from "../src/lib/api/testing/api-testing.module";

TestBed.configureTestingModule({
	errorOnUnknownElements: true,
	errorOnUnknownProperties: true,
	imports: [ApiTestingModule, TranslateTestingModule.withTranslations({}), NoopAnimationsModule],
	teardown: { destroyAfterEach: true }
});
