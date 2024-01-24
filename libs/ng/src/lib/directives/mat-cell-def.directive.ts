import { CdkCellDef } from "@angular/cdk/table";
import { Directive, Input } from "@angular/core";
import { MatCellDef, MatTableDataSource } from "@angular/material/table";
import { Observable } from "rxjs";

/**
 * Overrides the default mat-cell directive.
 *
 * Taken from https://github.com/angular/components/issues/22290#issuecomment-802981442.
 */
@Directive({
	// same selector as MatCellDef

	providers: [{ provide: CdkCellDef, useExisting: MatCellDefDirective }],
	// eslint-disable-next-line @angular-eslint/directive-selector -- Need to be the same
	selector: "[matCellDef]",
	standalone: true
})
export class MatCellDefDirective<T> extends MatCellDef {
	/** @internal */
	public static ngTemplateContextGuard<T>(
		dir: MatCellDefDirective<T>,
		ctx: unknown
	): ctx is { $implicit: T; index: number } {
		return true;
	}

	@Input()
	public matCellDefDataSource?: MatTableDataSource<T> | Observable<T[]> | T[];
}
