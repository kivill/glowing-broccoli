import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PointsService } from './points.service';
import { PointsController } from './points.controller';
import { CsvModule } from 'nest-csv-parser';

import { Point, PointSchema } from './schemas/point.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Point.name,
        schema: PointSchema
      }
    ]),
    CsvModule,
  ],
  controllers: [PointsController],
  providers: [PointsService]
})
export class PointsModule { }
