import { AuthController } from '../../../controllers/auth.controller';
import { Response } from 'express';
import { SignInResponseDto } from '../../../models/dtos/signInResponseDto';
import { ApiResponse } from '../../../models/apiResponse.model';

jest.mock('../../../config/logger', () => ({
  warn: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
}));

const mockRegisterUser = jest.fn();
const mockSignInUser = jest.fn();
const mockCreateJwtToken = jest.fn();
const mockCreateRefreshToken = jest.fn();
const mockRenewAccessToken = jest.fn();
const mockDeleteMe = jest.fn();

jest.mock('../../../service/auth.service', () => ({
  AuthService: jest.fn().mockImplementation(() => {
    return {
      registerUser: mockRegisterUser,
      signInUser: mockSignInUser,
      createJwtToken: mockCreateJwtToken,
      createRefreshToken: mockCreateRefreshToken,
      renewAccessToken: mockRenewAccessToken,
      deleteMe: mockDeleteMe,
    };
  }),
}));

let mockResponse: Response;
let controller = new AuthController();

beforeEach(() => {
  mockResponse = {
    send: jest.fn(),
    status: jest.fn(),
    json: jest.fn(),
    sendStatus: jest.fn(),
  } as unknown as Response;
});

describe('AuthController', () => {
  describe('registerUser', () => {
    test('creating user with correct register details, and return 201', async () => {
      mockRegisterUser.mockReturnValue({ created: true });
      await controller.registerUser({ login: 'test', password: 'password1!' }, mockResponse);
      expect((mockResponse.status as jest.Mock).mock.calls[0][0]).toBe(201);
      expect((mockResponse.json as jest.Mock).mock.calls[0][0]).toStrictEqual(
        new ApiResponse(undefined, 'Account has been creted', true),
      );
    });

    test('creating user with incorrect register details, and return 403', async () => {
      mockRegisterUser.mockReturnValue({ created: false });
      await controller.registerUser({ login: 'test', password: 'password1!' }, mockResponse);
      expect((mockResponse.status as jest.Mock).mock.calls[0][0]).toBe(403);
      expect((mockResponse.json as jest.Mock).mock.calls[0][0]).toStrictEqual(
        new ApiResponse(undefined, 'User already exist', false),
      );
    });

    test('creating user with incorrect register details, and return 400', async () => {
      mockRegisterUser.mockReturnValue(null);
      await controller.registerUser({ login: 'test', password: 'password1!' }, mockResponse);
      expect((mockResponse.status as jest.Mock).mock.calls[0][0]).toBe(400);
      expect((mockResponse.json as jest.Mock).mock.calls[0][0]).toStrictEqual(
        new ApiResponse(undefined, 'User not created due to invalid data', false),
      );
    });
  });

  describe('login user', () => {
    test('successfully login user, return 200', async () => {
      const token = 'abcd1234';
      const refreshToken = 'defg5678';
      mockSignInUser.mockReturnValue({ id: 1, login: 'test', password: 'password' });
      mockCreateJwtToken.mockReturnValue(token);
      mockCreateRefreshToken.mockReturnValue(refreshToken);
      await controller.signInUser({ login: 'test', password: 'password' }, mockResponse);
      expect((mockResponse.status as jest.Mock).mock.calls[0][0]).toBe(200);
      expect((mockResponse.json as jest.Mock).mock.calls[0][0]).toStrictEqual(
        new ApiResponse<SignInResponseDto>(new SignInResponseDto(token, refreshToken)),
      );
    });

    test('user not exist or password is incorrect, return 401', async () => {
      mockSignInUser.mockReturnValue(null);
      await controller.signInUser({ login: 'test', password: 'password' }, mockResponse);
      expect((mockResponse.status as jest.Mock).mock.calls[0][0]).toBe(401);
      expect((mockResponse.json as jest.Mock).mock.calls[0][0]).toStrictEqual(
        new ApiResponse(undefined, 'Failed attempt to log in to account', false),
      );
    });
  });

  describe('refresh JWT token', () => {
    test('valid refresh token, return new JWT token, status 200', async () => {
      const token = 'abcd1234';
      const refreshToken = 'defg5678';
      mockRenewAccessToken.mockReturnValue({ token: token, login: 'test' });
      await controller.refreshAccessToken({ refreshToken: refreshToken }, mockResponse);
      expect((mockResponse.status as jest.Mock).mock.calls[0][0]).toBe(200);
      expect((mockResponse.json as jest.Mock).mock.calls[0][0]).toStrictEqual(
        new ApiResponse<{ token: string }>({ token: token }, undefined, true),
      );
    });

    test('invalid refresh token, return new JWT token, status 400', async () => {
      const refreshToken = 'defg5678';
      mockRenewAccessToken.mockReturnValue({ token: null, login: null });
      await controller.refreshAccessToken({ refreshToken: refreshToken }, mockResponse);
      expect((mockResponse.status as jest.Mock).mock.calls[0][0]).toBe(400);
      expect((mockResponse.json as jest.Mock).mock.calls[0][0]).toStrictEqual(
        new ApiResponse<{ token: string }>(undefined, 'Refresh token expired or is invalid', false),
      );
    });

    test('no refresh token in request, return status 400', async () => {
      const refreshToken = '';
      await controller.refreshAccessToken({ refreshToken: refreshToken }, mockResponse);
      expect((mockResponse.status as jest.Mock).mock.calls[0][0]).toBe(400);
      expect((mockResponse.json as jest.Mock).mock.calls[0][0]).toStrictEqual(
        new ApiResponse<{ token: string }>(undefined, 'No refresh token in request', false),
      );
    });
  });

  describe('remove user account', () => {
    test('Account sucessfully deleted, return status 200', async () => {
      mockDeleteMe.mockReturnValue({ account: true, folder: true });
      await controller.deleteMe({ body: { password: '' }, user: { userId: '' } }, mockResponse);
      expect((mockResponse.status as jest.Mock).mock.calls[0][0]).toBe(200);
      expect((mockResponse.json as jest.Mock).mock.calls[0][0]).toStrictEqual(
        new ApiResponse(undefined, 'Account sucessfully deleted', true),
      );
    });

    test('Account sucessfully deleted but folder survive, return status 200', async () => {
      mockDeleteMe.mockReturnValue({ account: true, folder: false });
      await controller.deleteMe({ body: { password: '' }, user: { userId: '' } }, mockResponse);
      expect((mockResponse.status as jest.Mock).mock.calls[0][0]).toBe(200);
      expect((mockResponse.json as jest.Mock).mock.calls[0][0]).toStrictEqual(
        new ApiResponse(undefined, 'Account sucessfully deleted, but some file could survive', true),
      );
    });

    test('Account could not be deleted, return status 400', async () => {
      mockDeleteMe.mockReturnValue({ account: false, folder: false });
      await controller.deleteMe({ body: { password: '' }, user: { userId: '' } }, mockResponse);
      expect((mockResponse.status as jest.Mock).mock.calls[0][0]).toBe(400);
      expect((mockResponse.json as jest.Mock).mock.calls[0][0]).toStrictEqual(
        new ApiResponse(undefined, 'Account could not be deleted', false),
      );
    });
  });
});
