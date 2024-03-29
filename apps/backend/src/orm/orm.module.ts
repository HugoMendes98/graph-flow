import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";

import {
	ForeignKeyConstraintFilter,
	NotFoundFilter,
	UniqueConstraintFilter
} from "./filters";
import ormConfig from "../orm.config";

@Module({
	imports: [MikroOrmModule.forRoot({ ...ormConfig })],
	providers: [
		{ provide: APP_FILTER, useClass: ForeignKeyConstraintFilter },
		{ provide: APP_FILTER, useClass: NotFoundFilter },
		{ provide: APP_FILTER, useClass: UniqueConstraintFilter }
	]
})
export class OrmModule {}
