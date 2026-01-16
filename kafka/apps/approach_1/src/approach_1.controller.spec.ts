import { Test, TestingModule } from '@nestjs/testing';
import { Approach1Controller } from './approach_1.controller';
import { Approach1Service } from './approach_1.service';

describe('Approach1Controller', () => {
  let approach1Controller: Approach1Controller;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [Approach1Controller],
      providers: [Approach1Service],
    }).compile();

    approach1Controller = app.get<Approach1Controller>(Approach1Controller);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(approach1Controller.getHello()).toBe('Hello World!');
    });
  });
});
