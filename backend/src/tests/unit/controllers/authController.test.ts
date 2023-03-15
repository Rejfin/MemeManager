import { AuthController } from '../../../controllers/auth.controller';
import { Response } from 'express';

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
      expect((mockResponse.sendStatus as jest.Mock).mock.calls[0][0]).toBe(201);
    });

    test('creating user with incorrect register details, and return 403', async () => {
      mockRegisterUser.mockReturnValue({ created: false });
      await controller.registerUser({ login: 'test', password: 'password1!' }, mockResponse);
      expect((mockResponse.status as jest.Mock).mock.calls[0][0]).toBe(403);
      expect((mockResponse.send as jest.Mock).mock.calls[0][0]).toBe('user already exist');
    });

    test('creating user with incorrect register details, and return 400', async () => {
      mockRegisterUser.mockReturnValue(null);
      await controller.registerUser({ login: 'test', password: 'password1!' }, mockResponse);
      expect((mockResponse.sendStatus as jest.Mock).mock.calls[0][0]).toBe(400);
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
      expect((mockResponse.json as jest.Mock).mock.calls[0][0]).toStrictEqual({
        token: token,
        refreshToken: refreshToken,
      });
    });

    test('user not exist or password is incorrect, return 401', async () => {
      mockSignInUser.mockReturnValue(null);
      await controller.signInUser({ login: 'test', password: 'password' }, mockResponse);
      expect((mockResponse.sendStatus as jest.Mock).mock.calls[0][0]).toBe(401);
    });
  });

  describe('refresh JWT token', () => {
    test('valid refresh token, return new JWT token, status 200', async () => {
      const token = 'abcd1234';
      const refreshToken = 'defg5678';
      mockRenewAccessToken.mockReturnValue({ token: token, login: 'test' });
      await controller.refreshAccessToken({ refreshToken: refreshToken }, mockResponse);
      expect((mockResponse.status as jest.Mock).mock.calls[0][0]).toBe(200);
      expect((mockResponse.send as jest.Mock).mock.calls[0][0]).toStrictEqual({ token: token });
    });

    test('invalid refresh token, return new JWT token, status 200', async () => {
      const refreshToken = 'defg5678';
      mockRenewAccessToken.mockReturnValue({ token: null, login: null });
      await controller.refreshAccessToken({ refreshToken: refreshToken }, mockResponse);
      expect((mockResponse.sendStatus as jest.Mock).mock.calls[0][0]).toBe(400);
    });

    test('no refresh token in request, return status 400', async () => {
      const refreshToken = '';
      await controller.refreshAccessToken({ refreshToken: refreshToken }, mockResponse);
      expect((mockResponse.sendStatus as jest.Mock).mock.calls[0][0]).toBe(400);
    });
  });

  describe('remove user account', () => {
    test('Account sucessfully deleted, return status 200', async () => {
      mockDeleteMe.mockReturnValue({ account: true, folder: true });
      await controller.deleteMe({ body: { password: '' }, user: { userId: '' } }, mockResponse);
      expect((mockResponse.status as jest.Mock).mock.calls[0][0]).toBe(200);
      expect((mockResponse.send as jest.Mock).mock.calls[0][0]).toStrictEqual({
        message: 'Account sucessfully deleted',
      });
    });

    test('Account sucessfully deleted but folder survive, return status 200', async () => {
      mockDeleteMe.mockReturnValue({ account: true, folder: false });
      await controller.deleteMe({ body: { password: '' }, user: { userId: '' } }, mockResponse);
      expect((mockResponse.status as jest.Mock).mock.calls[0][0]).toBe(200);
      expect((mockResponse.send as jest.Mock).mock.calls[0][0]).toStrictEqual({
        message: 'Account sucessfully deleted, but some file could survive',
      });
    });

    test('Account could not be deleted, return status 400', async () => {
      mockDeleteMe.mockReturnValue({ account: false, folder: false });
      await controller.deleteMe({ body: { password: '' }, user: { userId: '' } }, mockResponse);
      expect((mockResponse.status as jest.Mock).mock.calls[0][0]).toBe(400);
      expect((mockResponse.send as jest.Mock).mock.calls[0][0]).toStrictEqual({
        message: 'Account could not be deleted',
      });
    });
  });
});
