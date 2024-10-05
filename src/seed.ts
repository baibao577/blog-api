import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppModule } from './app.module';
import { Author } from './entities/author.entity';
import { Category } from './entities/category.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const authorRepository = app.get(getRepositoryToken(Author));
  const categoryRepository = app.get(getRepositoryToken(Category));

  // Seed Authors
  const authors = [
    { name: 'John Doe' },
    { name: 'Jane Smith' },
    { name: 'Alice Johnson' },
    { name: 'Bob Wilson' },
    { name: 'Eva Brown' },
  ];

  for (const author of authors) {
    const existingAuthor = await authorRepository.findOne({
      where: { name: author.name },
    });
    if (!existingAuthor) {
      await authorRepository.save(author);
      console.log(`Author created: ${author.name}`);
    }
  }

  // Seed Categories
  const categories = [
    'Technology',
    'Science',
    'Politics',
    'Sports',
    'Entertainment',
    'Health',
    'Education',
    'Travel',
    'Food',
    'Fashion',
    'Business',
    'Art',
    'Music',
    'Literature',
    'Environment',
    'History',
    'Philosophy',
    'Psychology',
    'Lifestyle',
    'Fitness',
  ];

  for (const categoryName of categories) {
    const existingCategory = await categoryRepository.findOne({
      where: { name: categoryName },
    });
    if (!existingCategory) {
      await categoryRepository.save({ name: categoryName });
      console.log(`Category created: ${categoryName}`);
    }
  }

  console.log('Seeding complete!');
  await app.close();
}

bootstrap();
