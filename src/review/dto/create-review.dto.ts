import { IsNumber, IsString, Max, Min } from 'class-validator';
import { Types } from 'mongoose';

export class CreateReviewDto {
  @IsString()
  name: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @Min(1, { message: 'Рейтинг не может быть меньше 1' })
  @Max(5)
  @IsNumber()
  rating: number;

  @IsString()
  productId: string;
}
