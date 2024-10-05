import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from './posts/posts.module';
import { AuthorsModule } from './authors/authors.module';
import { CategoriesModule } from './categories/categories.module';
import { Post } from './entities/post.entity';
import { Author } from './entities/author.entity';
import { Category } from './entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'blog.sqlite',
      entities: [Post, Author, Category],
      synchronize: true, // set to false in production
    }),
    PostsModule,
    AuthorsModule,
    CategoriesModule,
  ],
})
export class AppModule {}
