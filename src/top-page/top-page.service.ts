import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  TopLevelCategory,
  TopPage,
  TopPageDocument,
} from './models/top-page.model';
import { Model } from 'mongoose';

@Injectable()
export class TopPageService {
  constructor(
    @InjectModel(TopPage.name) private TopPageEntity: Model<TopPageDocument>,
  ) {}

  async create(dto: TopPage) {
    return this.TopPageEntity.create(dto);
  }

  async getById(id: string) {
    return this.TopPageEntity.findById(id).exec();
  }

  async getByAlias(alias: string) {
    return this.TopPageEntity.findOne({ alias }).exec();
  }

  async findByCategory(firstCategory: TopLevelCategory) {
    return this.TopPageEntity.aggregate()
      .match({
        firstCategory,
      })
      .group({
        _id: { secondCategory: '$secondCategory' },
        pages: {
          $push: {
            alias: '$alias',
            title: '$title',
          },
        },
      })
      .exec();

    // ------ 2 разных способа, работают так же ------

    // return this.TopPageEntity.aggregate([
    //   {
    //     $match: {
    //       firstCategory: firstCategory,
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: { secondCategory: '$secondCategory' },
    //       pages: {
    //         $push: {
    //           alias: '$alias',
    //           title: '$title',
    //         },
    //       },
    //     },
    //   },
    // ]).exec();
  }

  async findBySearch(text: string) {
    return this.TopPageEntity.find({
      $text: {
        $search: text,
        $caseSensitive: false,
      },
    }).exec();
  }

  async deleteById(id: string) {
    return this.TopPageEntity.findByIdAndDelete(id).exec();
  }

  async updateById(id: string, dto: TopPage) {
    return this.TopPageEntity.findByIdAndUpdate(id, dto, { new: true }).exec();
  }
}
