import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { TranslateTestingModule } from "ngx-translate-testing";
import { ApiModule } from "~/lib/ng/lib/api";

import { ProfileView } from "./profile.view";

describe("ProfileView", () => {
	let component: ProfileView;
	let fixture: ComponentFixture<ProfileView>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				ApiModule.forRoot({ client: { url: "" } }),
				ProfileView,
				NoopAnimationsModule,
				TranslateTestingModule.withTranslations({})
			]
		}).compileComponents();

		fixture = TestBed.createComponent(ProfileView);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
