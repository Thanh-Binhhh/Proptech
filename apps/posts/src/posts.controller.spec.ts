import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PropertyPostsService } from './properties-posts/properties-posts.service';

describe('PostsController', () => {
  let postsController: PostsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [PropertyPostsService],
    }).compile();

    postsController = app.get<PostsController>(PostsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(postsController.getHello()).toBe('Hello World!');
    });
  });
});
