import { Injectable, BadRequestException, NotFoundException, ConflictException, Request } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { Point, PointDocument } from "../points/schemas/point.schema";
import { User } from 'src/user/schemas/user.schema';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<CommentDocument>,
    @InjectModel(Point.name) private readonly pointModel: Model<PointDocument>,
  ) { }

  async create(req, createCommentDto: CreateCommentDto) {
    const reqUser = req.user as User;
    const creator = reqUser._id;
    const comment = new this.commentModel({ creator, ...createCommentDto });
    return await comment.save();
  }

  async findAll() {
    return await this.commentModel.find({}).populate('creator', { fullName: 1 }).populate('point', { address: 1 });
  }

  async findOne(id: string) {
    const point = await this.pointModel.findOne({ _id: id })
    if (!point) {
      throw new NotFoundException('Point not found.');
    }
    await point.update({
      $inc: {"stat": 1}
    })
    await point.save();
    const comment = await this.commentModel.find({ point: point }).populate('creator', { fullName: 1 })
    return comment;
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    const comment = await this.commentModel.findOne({ _id: id })
    if (!comment) {
      throw new NotFoundException('Comment not found.');
    }
    comment.status = updateCommentDto.status;
    await comment.save();
    return comment;
  }
}
