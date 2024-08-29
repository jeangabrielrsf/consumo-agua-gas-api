import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Measure } from "./measures.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Measure])],
    exports: [TypeOrmModule]
})

export class MeasuresModule {}