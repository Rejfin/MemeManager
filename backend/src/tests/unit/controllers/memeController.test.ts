import { Response } from 'express';
import { MemeController } from '../../../controllers/meme.controller';
import { ApiResponse } from '../../../models/apiResponse.model';
import { Meme } from '../../../models/meme.model';
import { PaginatedData } from '../../../models/PaginatedData.model';

jest.mock('../../../config/logger', () => ({
  warn: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
}));

const mockGetMemes = jest.fn();
const mockCreateMeme = jest.fn();
const mockGetMeme = jest.fn();
const mockGetUnindexedAmount = jest.fn();
const mockGetUnindexedMemes = jest.fn();
const mockGetStatistics = jest.fn();
const mockRemoveMeme = jest.fn();

jest.mock('../../../service/meme.service', () => ({
  MemeService: jest.fn().mockImplementation(() => {
    return {
      getMemes: mockGetMemes,
      createMeme: mockCreateMeme,
      getMeme: mockGetMeme,
      getUnindexedAmount: mockGetUnindexedAmount,
      getUnindexedMemes: mockGetUnindexedMemes,
      getStatistics: mockGetStatistics,
      removeMeme: mockRemoveMeme,
    };
  }),
}));

let mockResponse: Response;
let controller = new MemeController();

beforeEach(() => {
  mockResponse = {
    send: jest.fn(),
    status: jest.fn(),
    json: jest.fn(),
    sendStatus: jest.fn(),
  } as unknown as Response;
});

describe('MemeController', () => {
  describe('get memes', () => {
    test('get memes, and return status 200', async () => {
      mockGetMemes.mockReturnValue({ rows: [{}], count: 1 });
      await controller.getMemes({ user: { userId: 'asdf-34fef-345t5' }, query: {} }, mockResponse);
      expect((mockResponse.status as jest.Mock).mock.calls[0][0]).toBe(200);
      expect((mockResponse.json as jest.Mock).mock.calls[0][0]).toStrictEqual(
        new ApiResponse<PaginatedData<Meme>>(new PaginatedData([{} as Meme], 1, 0, 0, 0)),
      );
    });

    test('get unindexed memes, and return status 200', async () => {
      const userId = 'sdfsdf-234345-sdfsdf';
      const page = 0;
      const limit = 25;
      mockGetUnindexedMemes.mockReturnValue({ rows: [{}, {}], count: 2 });
      await controller.getMemes(
        { user: { userId: userId }, query: { unindexed: '1', limit: limit, page: page } },
        mockResponse,
      );
      expect((mockResponse.status as jest.Mock).mock.calls[0][0]).toBe(200);
      expect(mockGetUnindexedMemes).toBeCalledWith(userId, limit, page);
      expect((mockResponse.json as jest.Mock).mock.calls[0][0]).toStrictEqual(
        new ApiResponse<PaginatedData<Meme>>(new PaginatedData([{} as Meme, {} as Meme], 2, 0, 0, 0)),
      );
    });
  });

  describe('create meme', () => {
    test('create meme with valid data, return status 200', async () => {
      const userId = 'sdfsdf-234345-sdfsdf';
      mockCreateMeme.mockReturnValue({
        id: 'aasd234',
        name: 'test',
        orignialName: 'original',
        size: 43.33,
        mimeType: 'image/jpg',
      });
      await controller.createMeme(
        {
          user: { userId: userId },
          file: {
            blurHash: 'sdfjg58uhgndfjk',
            filename: 'test',
            height: 1200,
            mimetype: 'image/jpg',
            originalname: 'original',
            width: 1800,
            size: 43.33,
          },
          body: { modifiedDate: '2023-12-17T02:24:00.000Z', tags: [] },
        },
        mockResponse,
      );
      expect((mockResponse.status as jest.Mock).mock.calls[0][0]).toBe(200);
      expect(mockCreateMeme).toBeCalled();
    });

    test('create meme with invalid data, return status 400', async () => {
      mockCreateMeme.mockReturnValue(null);
      await controller.createMeme({ user: { userId: 'asdasd' } } as any, mockResponse);
      expect((mockResponse.status as jest.Mock).mock.calls[0][0]).toBe(400);
      expect((mockResponse.json as jest.Mock).mock.calls[0][0]).toStrictEqual(
        new ApiResponse<Meme>(undefined, 'Meme could not be created', false),
      );
    });
  });

  describe('get meme data', () => {
    test('get valid data of meme, return status 200', async () => {
      mockGetMeme.mockReturnValue({
        id: 'asda-123-asd3w-d',
        name: 'test',
        size: 43.33,
        type: 'image/jpg',
        blurHash: 'sdfjg58uhgndfjk',
        height: 1200,
        width: 1800,
      });
      await controller.getMeme(
        { user: { userId: 'asdasd' }, params: { memeId: 'asda-123-asd3w-d' }, query: {} },
        mockResponse,
      );
      expect((mockResponse.status as jest.Mock).mock.calls[0][0]).toBe(200);
      expect((mockResponse.json as jest.Mock).mock.calls[0][0]).toStrictEqual(
        new ApiResponse<Meme>(
          {
            id: 'asda-123-asd3w-d',
            name: 'test',
            size: 43.33,
            type: 'image/jpg',
            blurHash: 'sdfjg58uhgndfjk',
            height: 1200,
            width: 1800,
          } as Meme,
          undefined,
          true,
        ),
      );
    });

    test('try to get data of meme with invalid params, return status 400', async () => {
      mockGetMeme.mockReturnValue(null);
      await controller.getMeme(
        { user: { userId: 'asdasd' }, params: { memeId: 'asda-123-asd3w-d' }, query: {} },
        mockResponse,
      );
      expect((mockResponse.status as jest.Mock).mock.calls[0][0]).toBe(400);
      expect((mockResponse.json as jest.Mock).mock.calls[0][0]).toStrictEqual(
        new ApiResponse(undefined, 'Could not retrive meme data', false),
      );
    });
  });

  describe('get statistics', () => {
    test('get statistics with valid user id, return status 200', async () => {
      const userId = 'asdasd-123234-asda';
      mockGetStatistics.mockReturnValue({ sizes: {}, counts: {} });
      await controller.getStatistics(userId, mockResponse);
      expect(mockGetStatistics).toBeCalledWith(userId);
      expect((mockResponse.status as jest.Mock).mock.calls[0][0]).toBe(200);
    });

    test('get statistics with invalid user id, return status 400', async () => {
      const userId = 'asdasd-123234-asda';
      mockGetStatistics.mockReturnValue(null);
      await controller.getStatistics(userId, mockResponse);
      expect(mockGetStatistics).toBeCalledWith(userId);
      expect((mockResponse.status as jest.Mock).mock.calls[0][0]).toBe(400);
      expect((mockResponse.json as jest.Mock).mock.calls[0][0]).toStrictEqual(
        new ApiResponse(undefined, 'statistics were not successfully retrived', false),
      );
    });
  });

  describe('Remove meme', () => {
    test('sucessfully remove meme (image), return status 200', async () => {
      const memeId = 'asd-asdasd-123-34';
      const userId = 'fgh-5464g-3efdgdf';
      mockRemoveMeme.mockReturnValue([true]);
      await controller.removeMeme(memeId, userId, mockResponse);
      expect(mockRemoveMeme).toBeCalledWith(memeId, userId);
      expect((mockResponse.status as jest.Mock).mock.calls[0][0]).toBe(200);
      expect((mockResponse.json as jest.Mock).mock.calls[0][0]).toStrictEqual(
        new ApiResponse(undefined, 'Meme sucessfully deleted', true),
      );
    });

    test('sucessfully remove meme (video), return status 200', async () => {
      const memeId = 'asd-asdasd-123-34';
      const userId = 'fgh-5464g-3efdgdf';
      mockRemoveMeme.mockReturnValue([true, true]);
      await controller.removeMeme(memeId, userId, mockResponse);
      expect(mockRemoveMeme).toBeCalledWith(memeId, userId);
      expect((mockResponse.status as jest.Mock).mock.calls[0][0]).toBe(200);
      expect((mockResponse.json as jest.Mock).mock.calls[0][0]).toStrictEqual(
        new ApiResponse(undefined, 'Meme sucessfully deleted', true),
      );
    });

    test('unsucessfully remove meme (image), return status 400', async () => {
      const memeId = 'asd-asdasd-123-34';
      const userId = 'fgh-5464g-3efdgdf';
      mockRemoveMeme.mockReturnValue([false]);
      await controller.removeMeme(memeId, userId, mockResponse);
      expect(mockRemoveMeme).toBeCalledWith(memeId, userId);
      expect((mockResponse.status as jest.Mock).mock.calls[0][0]).toBe(400);
      expect((mockResponse.json as jest.Mock).mock.calls[0][0]).toStrictEqual(
        new ApiResponse(undefined, 'Failed to delete meme', false),
      );
    });

    test('unsucessfully remove meme (video), return status 400', async () => {
      const memeId = 'asd-asdasd-123-34';
      const userId = 'fgh-5464g-3efdgdf';
      mockRemoveMeme.mockReturnValue([false, false]);
      await controller.removeMeme(memeId, userId, mockResponse);
      expect(mockRemoveMeme).toBeCalledWith(memeId, userId);
      expect((mockResponse.status as jest.Mock).mock.calls[0][0]).toBe(400);
      expect((mockResponse.json as jest.Mock).mock.calls[0][0]).toStrictEqual(
        new ApiResponse(undefined, 'Failed to delete meme file or its thumbnail', false),
      );
    });
  });
});
