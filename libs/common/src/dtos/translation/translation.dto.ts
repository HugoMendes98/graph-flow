import type { Type } from "@nestjs/common";
import { IsOptional, IsString } from "class-validator";

import { TranslationLanguage } from "./translation.type";
import { DtoProperty } from "../dto";

/**
 * Same as [TranslationDto]{@link TranslationDto}, but with its keys required,
 *	so it forces them to be implemented
 */
class TranslationRequiredDto implements Record<TranslationLanguage, string> {
	/**
	 * An empty string removes the key
	 */
	@DtoProperty()
	@IsOptional()
	@IsString()
	public en!: string;

	/**
	 * An empty string removes the key
	 */
	@DtoProperty()
	@IsOptional()
	@IsString()
	public fr!: string;
}

/**
 * This is just to trick TS:
 * We want [TranslationRequiredDto]{@link TranslationRequiredDto} to implements
 * **all** languages properties, although they are not necessary present.
 *
 * Without it, the previous class could be missing some languages.
 *
 * @param type The class to trick
 * @returns The same type
 */
function PartialDTO<T>(type: Type<T>): Type<Partial<T>> {
	return type;
}

/**
 * A `TranslationDto` contains keys of languages and its translation
 */
export class TranslationDto extends PartialDTO(TranslationRequiredDto) {}
