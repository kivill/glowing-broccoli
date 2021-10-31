import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { CreatePointDto } from './dto/create-point.dto';
import { UpdatePointDto } from './dto/update-point.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Point, PointDocument } from './schemas/point.schema';

import { CsvParser } from 'nest-csv-parser';
import { createReadStream, createWriteStream } from 'fs';

class PointFromCSV {
  createdAt: string;
  type: string;
  comment: string;
  address: string;
  coordinates: number[];
};
interface CsvFile {
  list: PointFromCSV[],
  count: number,
  offset: number,
  total: number
}

@Injectable()
export class PointsService {
  constructor(
    @InjectModel(Point.name) private readonly pointModel: Model<PointDocument>,
    private readonly csvParser: CsvParser,
  ) { }

  async create(createPointDto: CreatePointDto) {
    const point = new this.pointModel(createPointDto);
    if (point.type == '') {
      point.type = 'municipality'
    }
    point.status = 'approved';
    return await point.save();
  }

  async findAll() {
    return await this.pointModel.find({});
  }

  async findMunicipality() {
    return await this.pointModel.find({ type: 'municipality' });
  }

  async findOne(id: string) {
    const point = await this.pointModel.findOne({ _id: id })
    if (!point) {
      throw new NotFoundException('Point not found.');
    }
    return point;
  }

  async update(id: string, updatePointDto: UpdatePointDto) {
    const point = await this.pointModel.findOne({ _id: id })
    if (!point) {
      throw new NotFoundException('Point not found.');
    }
    return await this.pointModel.findByIdAndUpdate(id, { $set: updatePointDto }, {
      useFindAndModify: true, new: true
    });
  }

  async addView(id: string) {
    const point = await this.pointModel.findOne({ _id: id })
    if (!point) {
      throw new NotFoundException('Point not found.');
    }
    await point.save();
    return point;
  }

  async newFile(fileName): Promise<string> {
    const url = fileName.path
    return new Promise((resolve, reject) => {
      createReadStream(url)
        .pipe(createWriteStream(url + 'asdf'))
        .on('ready', async () => {
          const stream = createReadStream(url + 'asdf')
          const points = await this.csvParser.parse(stream, PointFromCSV) as CsvFile
          for (const point of points.list) {
            try {
              await this.create(point);
            } catch (error) {
              console.log(error)
            }
          }
        })
        .on('finish', () => {
          resolve(url)
        })
    })
  }

  async delete(id: string) {
    return await this.pointModel.findByIdAndRemove(id)
  }
}
