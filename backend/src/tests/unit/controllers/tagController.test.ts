import { Response } from 'express';
import { TagController } from '../../../controllers/tag.controller';
import { ApiResponse } from '../../../models/apiResponse.model';
import { PaginatedData } from '../../../models/PaginatedData.model';
import { Tag } from '../../../models/tag.model';

jest.mock('../../../config/logger', () => ({
  warn: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
}));

const mockGetTags = jest.fn();
const mockCreateTag = jest.fn();
const mockRemoveTag = jest.fn();

jest.mock('../../../service/tag.service', () => ({
  TagService: jest.fn().mockImplementation(() => {
    return {
      getTags: mockGetTags,
      createTag: mockCreateTag,
      removeTag: mockRemoveTag,
    };
  }),
}));

let mockResponse: Response;
const controller = new TagController();

beforeEach(() => {
  mockResponse = {
    send: jest.fn(),
    status: jest.fn(),
    json: jest.fn(),
    sendStatus: jest.fn(),
  } as unknown as Response;
});

describe('TagController', () => {
  describe('get tags', () => {
    test('get tags, and return status 200', async () => {
      mockGetTags.mockReturnValue({
        rows: [
          {
            id: 1,
            name: 'test',
          },
        ],
        count: 1,
      });
      await controller.getTags({ user: { userId: 'asdf-34fef-345t5' }, query: {} }, mockResponse);
      expect((mockResponse.status as jest.Mock).mock.calls[0][0]).toBe(200);
      expect((mockResponse.json as jest.Mock).mock.calls[0][0]).toStrictEqual(
        new ApiResponse<PaginatedData<{ id: number; name: string }>>(
          new PaginatedData(
            [
              {
                id: 1,
                name: 'test',
              },
            ],
            1,
            0,
            0,
            0,
          ),
        ),
      );
    });
  });

  describe('create tag', () => {
    test('create tag with valid data, return status 200', async () => {
      mockCreateTag.mockReturnValue({ id: 1, name: 'test' });
      await controller.createTag('test', 'dhbdfg-3455-sdf', mockResponse);
      expect((mockResponse.status as jest.Mock).mock.calls[0][0]).toBe(200);
      expect((mockResponse.json as jest.Mock).mock.calls[0][0]).toStrictEqual(
        new ApiResponse<Partial<Tag>>({ id: 1, name: 'test' }, undefined, true),
      );
    });

    test('trying creating tag without name, return status 400', async () => {
      const tagName = 'test';
      mockCreateTag.mockReturnValue(null);
      await controller.createTag(tagName, 'dhbdfg-3455-sdf', mockResponse);
      expect((mockResponse.status as jest.Mock).mock.calls[0][0]).toBe(400);
      expect((mockResponse.json as jest.Mock).mock.calls[0][0]).toStrictEqual(
        new ApiResponse(undefined, `No new tag named ${tagName} was created`, false),
      );
    });
  });

  describe('remove tag', () => {
    test('sucessfully remove tag, return status 200', async () => {
      mockRemoveTag.mockReturnValue(1);
      await controller.removeTag(1, 'sdfgdg-3453-45sdf', mockResponse);
      expect((mockResponse.status as jest.Mock).mock.calls[0][0]).toBe(200);
      expect((mockResponse.json as jest.Mock).mock.calls[0][0]).toStrictEqual(
        new ApiResponse(1, 'Tag successfully removed', true),
      );
    });

    test('unsucessfully remove tag, return status 400', async () => {
      mockRemoveTag.mockReturnValue(null);
      await controller.removeTag(1, 'sdfgdg-3453-45sdf', mockResponse);
      expect((mockResponse.status as jest.Mock).mock.calls[0][0]).toBe(400);
      expect((mockResponse.json as jest.Mock).mock.calls[0][0]).toStrictEqual(
        new ApiResponse(undefined, 'There was a problem while deleting the tag', false),
      );
    });
  });
});
