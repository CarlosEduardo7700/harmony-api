import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LessonReader } from 'src/modules/lesson/delegates/lesson-reader';
import { Lesson } from 'src/modules/lesson/lesson.entity';

const mockLessonRepository = {
  find: jest.fn(),
};

const makeSut = async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      LessonReader,
      {
        provide: getRepositoryToken(Lesson),
        useValue: mockLessonRepository,
      },
    ],
  }).compile();

  const sut = module.get<LessonReader>(LessonReader);

  return {
    sut,
  };
};

describe('Testes do delegate LessonReader', () => {
  beforeEach(() => {
    mockLessonRepository.find.mockClear();
  });

  test('Deve retornar 200 com uma lista das aulas de acordo com o mês e ano fornecidos', async () => {
    // Arrange
    const { sut } = await makeSut();
    const expectedLessons = [{ id: '1', title: 'Teste de Aula' }];
    mockLessonRepository.find.mockResolvedValue(expectedLessons);

    // Act
    const response = await sut.getLessons(9, 2025);

    // Assert
    expect(response).toEqual(expectedLessons);
  });
});
