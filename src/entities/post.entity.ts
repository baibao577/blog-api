import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Category } from '../entities/category.entity';
import { Author } from '../entities/author.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({
    type: 'simple-enum',
    enum: ['draft', 'published'],
    default: 'draft',
  })
  status: 'draft' | 'published';

  @ManyToOne(() => Category, (category) => category.posts)
  category: Category;

  @ManyToOne(() => Author, (author) => author.posts)
  author: Author;

  @CreateDateColumn()
  createdAt: Date;
}
