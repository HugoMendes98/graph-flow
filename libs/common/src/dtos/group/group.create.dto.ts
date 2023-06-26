import { IntersectionType, OmitType, PartialType } from "@nestjs/mapped-types";

import { GroupDto } from "./group.dto";
import { ENTITY_BASE_KEYS } from "../_lib/entity";
import { I18nCreateDto, I18N_CREATE_KEYS_MANDATORY } from "../_lib/i18n";

/**
 * DTO used to create [groups]{@link GroupDto}
 * in its {@link GroupEndpoint endpoint}.
 */
export class GroupCreateDto extends IntersectionType(
	I18nCreateDto,
	PartialType(OmitType(GroupDto, [...ENTITY_BASE_KEYS, ...I18N_CREATE_KEYS_MANDATORY]))
) {}
