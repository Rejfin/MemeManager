import { Response } from 'express';
import logger from '../config/logger';
import { ApiResponse } from '../models/apiResponse.model';
import { SignInResponseDto } from '../models/dtos/signInResponseDto';
import { AuthService } from '../service/auth.service';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * function used to register new user
   *
   * @return status 201 if user created successfully
   * @return status 403 if user already exist
   * @return status 400 if user was not created because of bad data
   */
  async registerUser(user: { login: string; password: string }, res: Response) {
    const data = await this.authService.registerUser(user);
    const response = new ApiResponse();
    if (data == null) {
      logger.warn('User not created due to invalid data');
      response.message = 'User not created due to invalid data';
      response.isSuccess = false;
      res.status(400);
      res.json(response);
    } else {
      if (data?.created == true) {
        logger.info(`User with login ${user.login} has been created`);
        response.message = 'Account has been creted';
        res.status(201);
        res.json(response);
      } else {
        logger.warn(`User with login ${user.login} already exist`);
        response.message = 'User already exist';
        response.isSuccess = false;
        res.status(403);
        res.json(response);
      }
    }
  }

  /**
   * function used to sign in user
   * @returns status 200, JWT token and refreshToken if user exist in databse and credentials are valid
   * @returns status 401 if user not exist or refreshToken could not be created
   */
  async signInUser(user: { login: string; password: string }, res: Response) {
    const response = new ApiResponse<SignInResponseDto>();
    const mUser = await this.authService.signInUser(user);

    if (mUser) {
      const token = this.authService.createJwtToken({
        userId: mUser.id,
        login: mUser.login,
      });
      const refreshToken = await this.authService.createRefreshToken(
        { userId: mUser.id, login: mUser.login },
        mUser.id,
      );
      if (refreshToken) {
        const data = new SignInResponseDto(token, refreshToken);
        response.data = data;
        logger.info(`User with login: ${user.login} logged in`);

        res.status(200);
        res.json(response);
      } else {
        logger.warn(`Failed attempt to log in to account: ${user.login}`);
        response.isSuccess = false;
        response.message = 'Failed attempt to log in to account';
        res.status(401);
        res.json(response);
      }
    } else {
      logger.warn(`Failed attempt to log in to account: ${user.login}`);
      response.isSuccess = false;
      response.message = 'Failed attempt to log in to account';
      res.status(401);
      res.json(response);
    }
  }

  /**
   * function used to generate new JWT token based on sended refreshToken
   */
  async refreshAccessToken(data: { refreshToken?: string }, res: Response) {
    const refreshToken = data.refreshToken;
    const response = new ApiResponse<{ token: string }>();

    if (refreshToken) {
      const data = await this.authService.renewAccessToken(refreshToken);

      if (data.token) {
        logger.info(`Refresh token for account with login: ${data.login}`);
        response.data = { token: data.token };
        res.status(200);
        res.json(response);
      } else {
        logger.info(`Refresh token expired or is invalid`);
        response.isSuccess = false;
        response.message = 'Refresh token expired or is invalid';
        res.status(400);
        res.json(response);
      }
    } else {
      logger.info(`No refresh token in request`);
      response.isSuccess = false;
      response.message = 'No refresh token in request';
      res.status(400);
      res.json(response);
    }
  }

  async logOut(refreshToken: string) {
    return await this.authService.logOut(refreshToken);
  }

  async deleteMe(req: { body: { password: string }; user: { userId: string } }, res: Response) {
    const isSuccess = await this.authService.deleteMe(req.user.userId, req.body.password);
    const response = new ApiResponse();

    if (isSuccess.account && isSuccess.folder) {
      logger.info(`Account with id: ${req.user.userId} has been deleted`);
      res.status(200);
      response.message = 'Account sucessfully deleted';
      res.json(response);
    } else if (isSuccess.account) {
      logger.warn(`Failed attempt to delete account folder id: ${req.user.userId}, but account deleted`);
      res.status(200);
      response.message = 'Account sucessfully deleted, but some file could survive';
      res.json(response);
    } else {
      logger.warn(`Failed attempt to delete account folder id: ${req.user.userId}`);
      res.status(400);
      response.message = 'Account could not be deleted';
      response.isSuccess = false;
      res.json(response);
    }
  }
}
