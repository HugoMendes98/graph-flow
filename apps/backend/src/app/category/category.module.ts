import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { CategoryController } from "./category.controller";
import { CategoryEntity } from "./category.entity";
import { CategoryService } from "./category.service";

@Module({
	controllers: [CategoryController],
	exports: [CategoryService],
	imports: [MikroOrmModule.forFeature([CategoryEntity])],
	providers: [CategoryService]
})
export class CategoryModule {}
