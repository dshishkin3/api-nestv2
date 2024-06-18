import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './models/product.model';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private ProductEntity: Model<ProductDocument>,
  ) {}

  async create(dto: Product) {
    return this.ProductEntity.create(dto);
  }

  async getById(id: string) {
    return this.ProductEntity.findById(id).exec();
  }

  async deleteById(id: string) {
    return this.ProductEntity.findByIdAndDelete(id).exec();
  }

  async updateById(id: string, dto: CreateProductDto) {
    return this.ProductEntity.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async findWithReviews(dto: FindProductDto) {
    const productsWithReviews = await this.ProductEntity.aggregate([
      { $match: { categories: dto.category } },
      { $sort: { _id: 1 } },
      { $limit: dto.limit },
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'productId',
          as: 'reviews',
        },
      },
      {
        $addFields: {
          reviewCount: { $size: '$reviews' },
          reviewAvg: { $avg: '$reviews.rating ' },
          reviews: {
            $function: {
              body: `function (reviews) {
                reviews.sort(
                  (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
                );
                return reviews;
              }`,
              args: ['$reviews'],
              lang: 'js',
            },
          },
        },
      },
    ]).exec();

    return productsWithReviews;
  }
}
