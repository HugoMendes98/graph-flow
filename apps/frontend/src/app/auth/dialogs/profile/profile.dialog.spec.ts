import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { BASE_SEED } from "~/lib/common/seeds";

import { ProfileDialog, ProfileDialogData } from "./profile.dialog";

describe("ProfileDialog", () => {
	let component: ProfileDialog;
	let fixture: ComponentFixture<ProfileDialog>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ProfileDialog]
		})
			.overrideProvider(MAT_DIALOG_DATA, {
				useValue: {
					user: BASE_SEED.users[0]
				} satisfies ProfileDialogData
			})
			.compileComponents();

		fixture = TestBed.createComponent(ProfileDialog);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
