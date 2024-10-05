import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from '../entities/post.entity';
import { Category } from '../entities/category.entity';
import { Author } from '../entities/author.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Category, Author])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
