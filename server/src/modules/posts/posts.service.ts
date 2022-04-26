import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { PostQuery } from './dto/query-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { SearchPostDto } from './dto/search-post.dto';
import { Posts, PostsDocument, Items, ItemsDocument } from './schemas/posts.schema';
import * as R from 'ramda';


@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Posts.name) private postsModel: Model<PostsDocument>,
    @InjectModel(Items.name) private itemsModel: Model<ItemsDocument>,
  ) { }

  async create(input: CreatePostDto) {
    const { items, loc } = input;

    // Transform items 
    const serverItems = await this.findAllItems();
    const postItems = items.map((element: any) => {
      return {
        item: serverItems.find(i => i._id === element.item),
        amount: element.amount
      }
    });

    // Transform locs
    const { lat, lng } = loc;
    const locTransform = {
      type: 'Point',
      coordinates: [lng, lat]
    }

    const postInput = {
      ...input,
      loc: locTransform,
      items: postItems
    };

    const newPost = await this.postsModel.create(postInput);
    return newPost;
  }

  async findAllLocs() {
    // const allPosts = await this.postsModel.find({}).limit(2).lean();
    const allPosts = await this.postsModel.find({}).lean();

    const allLocs = R.map(
      R.pick(['loc', 'type', 'isFinished', 'showMap', '_id']),
      allPosts
    );

    return allLocs;
  }

  async search(query: SearchPostDto) {
    const { searchType, searchInput } = query;
    let post: PostsDocument;

    if (searchType === 'phone') {
      post = await this.postsModel.findOne({ phoneNumber: searchInput }).lean();
    }

    if (searchType === 'address') {
      post = await this.postsModel.findOne({ address: searchInput }).lean();
    }

    if (!post) throw new HttpException("NotFound", HttpStatus.NOT_FOUND);

    const loc = R.pick(['loc', 'type', 'isFinished', 'showMap', '_id'], post);

    return loc;
  }

  async findAllItems() {
    return await this.itemsModel.find({}).lean();
  }

  findAll(query: PostQuery) {
    return `This action returns all posts`;
  }

  async findOne(id: string) {
    const post = await this.postsModel.findById(id);
    return post;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
