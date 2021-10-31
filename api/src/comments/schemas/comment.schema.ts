import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import * as mongoose from 'mongoose';

import { User } from "../../user/schemas/user.schema";
import { Point } from "../../points/schemas/point.schema";

export type CommentDocument = Comment & Document;

@Schema({
    versionKey: false,
    timestamps: true,
})
export class Comment {
    _id: MongooseSchema.Types.ObjectId;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'USER_IS_BLANK']
    })
    creator: User;

    @Prop({ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Point',
        required: [true, 'POINT_IS_BLANK']
    })
    point: Point;

    @Prop({
        minlength: 6,
        required: [true, 'COMMENT_IS_BLANK']
    })
    comment: string;

    @Prop({
        enum: ['created', 'declined', 'approved'],
        default: 'created',
        required: [true, 'STATUS_IS_BLANK']
    })
    status: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
