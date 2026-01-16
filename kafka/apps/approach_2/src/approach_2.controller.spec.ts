import { Test, TestingModule } from '@nestjs/testing';
import { Approach2Controller } from './approach_2.controller';
import { Approach2Service } from './approach_2.service';

describe('Approach2Controller', () => {
  let approach2Controller: Approach2Controller;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [Approach2Controller],
      providers: [Approach2Service],
    }).compile();

    approach2Controller = app.get<Approach2Controller>(Approach2Controller);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(approach2Controller.getHello()).toBe('Hello World!');
    });
  });
});
