import { PickType } from "@nestjs/mapped-types";

import { I18nDto } from "./i18n.dto";

/**
 * The mandatory keys for creating an i18n entity
 */
export const I18N_CREATE_KEYS_MANDATORY = ["_name"] as const satisfies ReadonlyArray<keyof I18nDto>;

/**
 * Base DTO used to create a [I18nDto]{@link I18nDto}.
 */
export class I18nCreateDto extends PickType(I18nDto, I18N_CREATE_KEYS_MANDATORY) {}
