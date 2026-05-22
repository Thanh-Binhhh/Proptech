import { Test, TestingModule } from '@nestjs/testing';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';

describe('ContactController', () => {
  let contactController: ContactController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ContactController],
      providers: [ContactService],
    }).compile();

    contactController = app.get<ContactController>(ContactController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(contactController.getHello()).toBe('Hello World!');
    });
  });
});
