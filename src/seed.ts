import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppModule } from './app.module';
import { Author } from './entities/author.entity';
import { Category } from './entities/category.entity';
import { Post } from './entities/post.entity';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const authorRepository = app.get(getRepositoryToken(Author));
  const categoryRepository = app.get(getRepositoryToken(Category));
  const postRepository = app.get(getRepositoryToken(Post));

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

  const createdCategories = [];
  for (const categoryName of categories) {
    const existingCategory = await categoryRepository.findOne({
      where: { name: categoryName },
    });
    if (!existingCategory) {
      const newCategory = await categoryRepository.save({ name: categoryName });
      createdCategories.push(newCategory);
      console.log(`Category created: ${categoryName}`);
    } else {
      createdCategories.push(existingCategory);
    }
  }

  // Seed Authors
  const authors = [
    { id: 1, name: 'Admin Author', username: 'admin' },
    { name: 'Jane Smith', username: 'jane' },
    { name: 'Alice Johnson', username: 'alice' },
    { name: 'Bob Wilson', username: 'bob' },
    { name: 'Eva Brown', username: 'eva' },
  ];

  const defaultPassword = 'password123'; // In a real scenario, use unique, strong passwords
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  const createdAuthors = [];
  for (const author of authors) {
    const existingAuthor = await authorRepository.findOne({
      where: { username: author.username },
    });
    if (!existingAuthor) {
      const newAuthor = await authorRepository.save({
        ...author,
        password: hashedPassword,
      });
      createdAuthors.push(newAuthor);
      console.log(`Author created: ${author.name} (${author.username})`);
    } else {
      // Update existing author's password
      existingAuthor.password = hashedPassword;
      await authorRepository.save(existingAuthor);
      createdAuthors.push(existingAuthor);
      console.log(`Author updated: ${author.name} (${author.username})`);
    }
  }

  // Seed Posts
  for (const author of createdAuthors) {
    for (let i = 0; i < 10; i++) {
      const randomCategory = faker.helpers.arrayElement(createdCategories);
      const post = await postRepository.save({
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraphs(3),
        status: 'published',
        author: author,
        category: randomCategory,
        createdAt: faker.date.past(),
      });
      console.log(`Post created: "${post.title}" by ${author.name}`);
    }
  }

  console.log('Seeding complete!');
  await app.close();
}

bootstrap();
