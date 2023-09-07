import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { TranslateTestingModule } from "ngx-translate-testing";
import { ApiModule } from "~/lib/ng/lib/api";

import { LoginView } from "./login.view";

describe("LoginView", () => {
	let component: LoginView;
	let fixture: ComponentFixture<LoginView>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				ApiModule.forRoot({ client: { url: "" } }),
				LoginView,
				NoopAnimationsModule,
				TranslateTestingModule.withTranslations({})
			]
		}).compileComponents();

		fixture = TestBed.createComponent(LoginView);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
