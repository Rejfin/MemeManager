import { Response } from 'express';
import logger from '../config/logger';
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
    if (data == null) {
      logger.warn('User not created due to invalid data');
      res.sendStatus(400);
    } else {
      if (data?.created == true) {
        logger.info(`User with login ${user.login} has been created`);
        res.sendStatus(201);
      } else {
        logger.warn(`User with login ${user.login} already exist`);
        res.status(403).send('user already exist');
      }
    }
  }

  /**
   * function used to sign in user
   * @returns status 200, JWT token and refreshToken if user exist in databse and credentials are valid
   * @returns status 401 if user not exist
   */
  async signInUser(user: { login: string; password: string }, res: Response) {
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
        logger.info(`User with login: ${user.login} logged in`);
        res.status(200).json({ token: token, refreshToken: refreshToken });
      } else {
        logger.warn(`Failed attempt to log in to account: ${user.login}`);
        res.sendStatus(401);
      }
    } else {
      logger.warn(`Failed attempt to log in to account: ${user.login}`);
      res.sendStatus(401);
    }
  }

  /**
   * function used to generate new JWT token based on sended refreshToken
   */
  async refreshAccessToken(data: { refreshToken?: string }, res: Response) {
    const refreshToken = data.refreshToken;

    if (refreshToken) {
      const data = await this.authService.renewAccessToken(refreshToken);

      if (data.token) {
        logger.info(`Refresh token for account with login: ${data.login}`);
        res.status(200).send({ token: data.token });
      } else {
        logger.info(`Refresh token expired or is invalid`);
        res.sendStatus(400);
      }
    } else {
      logger.info(`No refresh token in request`);
      res.sendStatus(400);
    }
  }

  async logOut(refreshToken: string) {
    return await this.authService.logOut(refreshToken);
  }

  async deleteMe(req: { body: { password: string }; user: { userId: string } }, res: Response) {
    const isSuccess = await this.authService.deleteMe(req.user.userId, req.body.password);

    if (isSuccess) {
      logger.info(`Account with id: ${req.user.userId} has been deleted`);
      res.status(200).send({ message: 'Account sucessfully deleted' });
    } else {
      logger.warn(`Failed attempt to delete account with id: ${req.user.userId}`);
      res.status(400).send({ message: 'Failed to delete account' });
    }
  }
}
