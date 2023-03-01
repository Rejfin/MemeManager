import { Response } from 'express';
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
      res.sendStatus(400);
    } else {
      if (data?.created == true) {
        res.sendStatus(201);
      } else {
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
      res.status(200).json({ token: token, refreshToken: refreshToken });
    } else {
      res.sendStatus(401);
    }
  }

  /**
   * function used to generate new JWT token based on sended refreshToken
   */
  async refreshAccessToken(data: { refreshToken?: string }, res: Response) {
    const refreshToken = data.refreshToken;

    if (refreshToken) {
      const newToken = await this.authService.renewAccessToken(refreshToken);

      if (newToken) {
        res.status(200).send({ token: newToken });
      } else {
        res.sendStatus(400);
      }
    } else {
      res.sendStatus(400);
    }
  }

  async logOut(refreshToken: string) {
    return await this.authService.logOut(refreshToken);
  }

  async deleteMe(req: { body: { password: string }; user: { userId: string } }, res: Response) {
    const isSuccess = await this.authService.deleteMe(req.user.userId, req.body.password);
    console.log(isSuccess);
    
    if (isSuccess) {
      res.status(200).send({ message: 'Account sucessfully deleted' });
    } else {
      res.status(400).send({ message: 'Failed to delete account' });
    }
  }
}
