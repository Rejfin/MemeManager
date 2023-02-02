import { Response } from 'express';
import { AuthService } from '../service/auth.service';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

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
}
