import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { FileService } from './file.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsSchema, Posts, ItemsSchema, Items } from './schemas/posts.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Posts.name, schema: PostsSchema }, { name: Items.name, schema: ItemsSchema }]),
  ],
  controllers: [PostsController],
  providers: [PostsService, FileService],
})

export class PostsModule { }
