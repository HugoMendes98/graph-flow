import { PartialType } from "@nestjs/mapped-types";

import { CategoryCreateDto } from "./category.create.dto";

/**
 * DTO used to update [category]{@link CategoryDto}
 * in its {@link CategoryEndpoint endpoint}.
 */
export class CategoryUpdateDto extends PartialType(CategoryCreateDto) {}
