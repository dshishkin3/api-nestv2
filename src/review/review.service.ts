import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Review, ReviewDocument } from './models/review.model';
import { Model, Types } from 'mongoose';
import { CreateReviewDto } from './dto/create-review.dto';

class Leak {}

const leaks = [];

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private ReviewEntity: Model<ReviewDocument>,
  ) {}

  async create(dto: CreateReviewDto) {
    return this.ReviewEntity.create(dto);
  }

  async delete(id: string) {
    return this.ReviewEntity.findByIdAndDelete(id).exec();
  }

  async findByProductId(productId: string) {
    leaks.push(new Leak());
    return this.ReviewEntity.find({
      // productId: new Types.ObjectId(productId),
      productId: productId,
    }).exec();
  }

  async deleteByProductId(productId: string) {
    return this.ReviewEntity.deleteMany({
      productId: new Types.ObjectId(productId),
    }).exec();
  }
}
