import {
  Controller, Get, Post, Body, Patch, Param,
  Delete, Query, CacheInterceptor, UseInterceptors,
  CacheKey, CacheTTL, Catch
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { FileService } from './file.service'
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostQuery } from './dto/query-post.dto';
import { SearchPostDto } from './dto/search-post.dto';
import { GetUploadSignedUrlDto } from './dto/get-presign-url.dto';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly fileService: FileService
  ) { }

  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    console.log("Create Post", createPostDto);
    return await this.postsService.create(createPostDto);
  }

  @Get()
  findAll(@Query() query: PostQuery) {
    return this.postsService.findAll(query);
  }

  @Get('search')
  async searchPost(@Query() query: SearchPostDto) {
    return await this.postsService.search(query);
  }

  @CacheKey('all_locs')
  @CacheTTL(60 * 60 * 24)
  @Get('locs')
  @UseInterceptors(CacheInterceptor)
  async findAllLocs() {
    return await this.postsService.findAllLocs();
  }

  @CacheKey('items')
  @CacheTTL(60 * 60 * 24)
  @Get('items')
  @UseInterceptors(CacheInterceptor)
  async findAllItems() {
    return await this.postsService.findAllItems();
  }

  @Post('presigned-url')
  async getPresignUrl(@Body() input: GetUploadSignedUrlDto) {
    return await this.fileService.getPresignUrl('putObject', input.fileName);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.postsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
