import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Comment, CommentSchema } from "./schemas/comment.schema";
import { PointsModule } from "../points/points.module";
import { Point, PointSchema } from "../points/schemas/point.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Comment.name,
        schema: CommentSchema,
      }
    ]),
    MongooseModule.forFeature([
      {
        name: Point.name,
        schema: PointSchema,
      }
    ]),
    PointsModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService]
})
export class CommentsModule { }
