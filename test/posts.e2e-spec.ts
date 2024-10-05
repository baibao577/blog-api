import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('PostsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/posts (GET)', () => {
    return request(app.getHttpServer())
      .get('/posts')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBeTruthy();
      });
  });

  it('/posts (POST)', () => {
    return request(app.getHttpServer())
      .post('/posts')
      .send({ title: 'Test Post', content: 'Test Content', status: 'draft' })
      .expect(201)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body.title).toBe('Test Post');
        expect(res.body.content).toBe('Test Content');
        expect(res.body.status).toBe('draft');
      });
  });

  // Add more tests for other endpoints (GET /:id, PUT /:id, DELETE /:id)

  afterAll(async () => {
    await app.close();
  });
});
