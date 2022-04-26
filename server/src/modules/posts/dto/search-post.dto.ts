import { IsIn, IsString } from 'class-validator';

export class SearchPostDto {
  @IsIn(['phone', 'address'])
  searchType: 'phone' | 'address';

  @IsString()
  searchInput: string;
}
