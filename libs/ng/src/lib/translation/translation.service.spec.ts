import { TestBed } from "@angular/core/testing";
import { TranslateTestingModule } from "ngx-translate-testing";

import { TranslationService } from "./translation.service";

describe("TranslationService", () => {
	let service: TranslationService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [TranslateTestingModule.withTranslations({})]
		});
		service = TestBed.inject(TranslationService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});
