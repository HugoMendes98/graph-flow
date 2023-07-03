import { CategoryDto } from "./category.dto";
import { FindQueryDtoOf } from "../_lib/find-query.dto";

/**
 * DTO Query used to filter [categories]{@link CategoryDto}
 * in its {@link CategoryEndpoint endpoint}.
 */
export class CategoryQueryDto extends FindQueryDtoOf(CategoryDto) {}
