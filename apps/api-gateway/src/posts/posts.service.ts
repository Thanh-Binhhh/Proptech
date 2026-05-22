import { Inject, Injectable } from '@nestjs/common';
import { POSTS } from '../constant';
import { ClientProxy } from '@nestjs/microservices';
import { POSTS_PATTERNS } from '@app/contracts/posts/books.patterns';
import { handleMicroserviceError } from '@app/contracts/helper-functions';

@Injectable()
export class PostsService {
  constructor(
    @Inject(POSTS)
    private readonly postService: ClientProxy
  ) { }

  create = async (request) => {
    try {
      return this.postService.send(POSTS_PATTERNS.CREATE, createPostDto);

    } catch (error) {
            handleMicroserviceError(error)
        }
  }

  /*==========================
      HELPER FUNCTIONS
    ============================*/
}
