import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import * as mongoose from 'mongoose';

export type PointDocument = Point & Document;

@Schema({
    versionKey: false,
    timestamps: true,
})
export class Point {
    _id: MongooseSchema.Types.ObjectId;

    @Prop({
        required: [true, 'TYPE_IS_BLANK'],
        default: 'municipality',
    })
    type: string;

    @Prop()
    comment: string;

    @Prop({
        minlength: 6,
        maxlength: 255,
        required: [true, 'ADDRESS_IS_BLANK']
    })
    address: string;

    @Prop({
        type: [Number],
        required: [true, 'COORDINATES_IS_BLANK']
    })
    coordinates: number[];

    @Prop({
        enum: ['created', 'declined', 'approved'],
        default: 'approved',
        required: [true, 'STATUS_IS_BLANK']
    })
    status: string;
    @Prop({
        type: [String]
    })
    subType: string[];

    @Prop()
    stat: number;
}

export const PointSchema = SchemaFactory.createForClass(Point);