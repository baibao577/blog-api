import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Category } from '../entities/category.entity';
import { Author } from '../entities/author.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(Author)
    private authorsRepository: Repository<Author>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const { authorId, categoryId, ...postData } = createPostDto;

    const author = await this.authorsRepository.findOne({
      where: { id: authorId },
    });
    if (!author) {
      throw new NotFoundException(`Author with ID "${authorId}" not found`);
    }

    const category = await this.categoriesRepository.findOne({
      where: { id: categoryId },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID "${categoryId}" not found`);
    }

    const post = this.postsRepository.create({
      ...postData,
      author,
      category,
    });

    return this.postsRepository.save(post);
  }

  async findAll(
    page: number = 1,
    limit: number = 5,
    orderBy: 'ASC' | 'DESC' = 'DESC',
    categoryId?: number,
  ) {
    const queryBuilder = this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.category', 'category')
      .where('post.status = :status', { status: 'published' })
      .orderBy('post.createdAt', orderBy)
      .skip((page - 1) * limit)
      .take(limit);

    if (categoryId) {
      queryBuilder.andWhere('category.id = :categoryId', { categoryId });
    }

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author', 'category'],
    });
    if (!post) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }
    return post;
  }

  async update(
    id: number,
    updatePostDto: UpdatePostDto,
    userId: number,
  ): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author', 'category'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }

    if (post.author.id !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to edit this post',
      );
    }

    // Handle category update
    if (
      updatePostDto.categoryId &&
      updatePostDto.categoryId !== post.category.id
    ) {
      post.category.id = updatePostDto.categoryId;
    }

    // Update other fields
    Object.assign(post, updatePostDto);

    // Remove categoryId from updatePostDto as it's not a direct property of Post entity
    delete (updatePostDto as any).categoryId;

    return this.postsRepository.save(post);
  }

  async remove(id: number, userId: number) {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!post) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }
    if (post.author.id !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to delete this post',
      );
    }
    await this.postsRepository.remove(post);
  }
}
