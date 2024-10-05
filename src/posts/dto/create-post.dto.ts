import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsEnum(['draft', 'published'])
  @IsOptional()
  status?: 'draft' | 'published' = 'draft';

  @IsNotEmpty()
  categoryId: number;

  @IsNotEmpty()
  authorId: number;
}
