import { IsArray } from 'class-validator';

export class GetUploadSignedUrlDto {
  @IsArray()
  fileName: string[];
}

