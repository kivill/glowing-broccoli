import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import * as mongoose from 'mongoose';
import validator from 'validator';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;


@Schema({
    versionKey: false,
    timestamps: true,
})
export class User {
    _id: MongooseSchema.Types.ObjectId;
    @Prop({
        minlength: 5,
        maxlength: 255,
        required: [true, 'NAME_IS_BLANK']
    })
    fullName: string;

    @Prop({
        lowercase: true,
        validate: validator.isEmail,
        maxlength: 255,
        minlength: 6,
        required: [true, 'EMAIL_IS_BLANK']
    })
    email: string;

    @Prop({
        minlength: 5,
        maxlength: 1024,
        required: [true, 'PASSWORD_IS_BLANK']
    })
    password: string;

    @Prop({
        default: 'user',
        enum: ['admin', 'municipality', 'user'],
        required: [true, 'PASSWORD_IS_BLANK']
    })
    roles: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next: mongoose.HookNextFunction) {
    try {
        if (!this.isModified('password')) {
            return next();
        }
        // tslint:disable-next-line:no-string-literal
        const hashed = await bcrypt.hash(this['password'], 10);
        // tslint:disable-next-line:no-string-literal
        this['password'] = hashed;
        return next();
    } catch (err) {
        return next(err);
    }
});
