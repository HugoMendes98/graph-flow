import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { TranslateTestingModule } from "ngx-translate-testing";

import { LoginCardComponent } from "./login-card.component";

describe("LoginCardComponent", () => {
	let component: LoginCardComponent;
	let fixture: ComponentFixture<LoginCardComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				LoginCardComponent,
				NoopAnimationsModule,
				TranslateTestingModule.withTranslations({})
			]
		}).compileComponents();

		fixture = TestBed.createComponent(LoginCardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
