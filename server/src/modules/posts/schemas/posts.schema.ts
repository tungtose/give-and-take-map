import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

type Nullable<T> = T | null;

@Schema({ timestamps: true, collection: 'geolocation' })
export class GeoLocation {
  @Prop({ type: String })
  type: string;

  @Prop({ types: Array })
  coordinates: Array<number>;
}

export const GeoLocationSchema = SchemaFactory.createForClass(GeoLocation);

@Schema({ timestamps: true, collection: 'unit' })
export class Unit {
  @Prop({ type: String })
  name: string;
}

export const UnitSchema = SchemaFactory.createForClass(Unit);

@Schema({ timestamps: true, collection: 'items' })
export class Items {
  @Prop({ type: String })
  type: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  slug: string;

  @Prop({ type: String })
  unit: string;
}

export type ItemsDocument = Items & Document;
export const ItemsSchema = SchemaFactory.createForClass(Items);

@Schema({ timestamps: true, collection: 'post-items' })
export class PostItems {
  @Prop({ type: Number })
  amount: number;

  @Prop({ type: ItemsSchema })
  item: Items;
}
export const PostItemsSchema = SchemaFactory.createForClass(PostItems);

@Schema({ timestamps: true, collection: 'posts' })
export class Posts {
  _id: string;

  @Prop({ type: Boolean })
  showMap: boolean;

  @Prop({ type: Boolean })
  isFinished: boolean;

  @Prop({ type: String })
  status?: Nullable<string>;

  @Prop({ type: String })
  priority?: Nullable<string>;

  @Prop({ type: Boolean })
  isAgreePublicPhoneNumber: boolean;

  @Prop({ type: String })
  warningType?: Nullable<string>;

  @Prop({ type: Boolean })
  isCancel: boolean;

  @Prop({ type: GeoLocationSchema })
  loc: GeoLocation;

  @Prop({ type: String })
  type: string;

  @Prop({ type: String })
  address: string;

  @Prop({ type: String })
  note: string;

  @Prop({ type: String })
  phoneNumber: string;

  @Prop({ type: [String] })
  imageUrls: string[];

  @Prop({ type: [PostItemsSchema] })
  items: PostItems[];

  @Prop({ type: String })
  name: string;
}

export type PostsDocument = Posts & Document;

export const PostsSchema = SchemaFactory.createForClass(Posts);
