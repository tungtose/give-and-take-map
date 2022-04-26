import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class PostQuery {
  @IsInt()
  @Type(() => Number)
  page: number;

  @IsInt()
  @Type(() => Number)
  record: number;
}
