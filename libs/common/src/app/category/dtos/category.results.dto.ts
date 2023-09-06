import { CategoryDto } from "./category.dto";
import { FindResultsDtoOf } from "../../../dtos/find-results.dto";

/**
 * DTO results when listing [categories]{@link CategoryDto}.
 */
export class CategoryResultsDto extends FindResultsDtoOf(CategoryDto) {}
