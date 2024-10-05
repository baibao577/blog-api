import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Post } from './post.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Author {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  username: string;

  @Column()
  @Exclude()
  password: string;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];
}
