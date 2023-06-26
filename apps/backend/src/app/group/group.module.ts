import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

import { GroupController } from "./group.controller";
import { Group } from "./group.entity";
import { GroupService } from "./group.service";

@Module({
	controllers: [GroupController],
	exports: [GroupService],
	imports: [MikroOrmModule.forFeature([Group])],
	providers: [GroupService]
})
export class GroupModule {}
