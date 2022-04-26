import { IsArray, IsInt, IsMongoId, IsNumber, IsPhoneNumber, IsString, Length, ValidateNested } from 'class-validator';

export class GeoLocation {
  @IsNumber()
  lat: number;
  @IsNumber()
  lng: number;
}


export class Unit {
  @IsString()
  name: string;
}

export class Items {
  @IsString()
  type: string;

  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsString()
  unit: Unit;
}

export class PostItem {
  @IsInt()
  amount: number;

  @IsMongoId()
  item: string;
}

export class CreatePostDto {
  @IsString()
  address: string;

  @ValidateNested()
  loc: GeoLocation;

  @IsString()
  @Length(10, 500)
  note: string;

  @IsPhoneNumber("VN")
  phoneNumber: string;

  @ValidateNested()
  items: PostItem[];

  @IsArray()
  imageUrls: string[];

}
