import { AuthRepository } from '../repository/auth.repository';
import jwt from 'jsonwebtoken';
import { rm } from 'fs';

export class AuthService {
  private authRepository: AuthRepository;

  constructor() {
    this.authRepository = new AuthRepository();
  }

  /**
   * register user after checks if login and password meet the requirements
   */
  async registerUser(user: { login: string; password: string }) {
    if (
      user.login.length >= 4 &&
      user.password.length >= 6 &&
      /[0-9]+/.test(user.password) &&
      /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(user.password)
    ) {
      return await this.authRepository.registerUser(user);
    } else {
      return null;
    }
  }

  async signInUser(user: { login: string; password: string }) {
    const mUser = await this.authRepository.signinUser(user);
    return mUser;
  }

  async createRefreshToken(payload: object, userId: string): Promise<string> {
    // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
    const REFRESH_TOKEN = process.env.TOKEN_REFRESH_SECRET!;
    const REFRESH_EXP = process.env.JWT_REFRESH_EXP;
    const token = jwt.sign(payload, REFRESH_TOKEN, { expiresIn: REFRESH_EXP });
    await this.authRepository.saveTokenToUser(token, userId);
    return token;
  }

  createJwtToken(payload: object): string {
    // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
    const ACCESS_TOKEN = process.env.TOKEN_SECRET!;
    const TOKEN_EXP = process.env.JWT_EXP;
    const token = jwt.sign(payload, ACCESS_TOKEN, { expiresIn: TOKEN_EXP });
    return token;
  }

  /**
   * function create new jwt token if provided refreshToken is valid
   * @param refreshToken
   * @returns new Jwt token
   */
  async renewAccessToken(refreshToken: string): Promise<string | null> {
    const mRefreshToken = this.authRepository.findRefreshToken(refreshToken);
    if (!mRefreshToken) {
      return null;
    }
    // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
    const REFRESH_TOKEN = process.env.TOKEN_REFRESH_SECRET!;
    let newToken = null;
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    jwt.verify(refreshToken, REFRESH_TOKEN, (err: any, data: any) => {
      if (err) {
        newToken = null;
        return;
      }

      newToken = this.createJwtToken({
        userId: data.userId,
        login: data.login,
      });
      return;
    });
    return newToken;
  }

  async logOut(refreshToken: string) {
    await this.authRepository.signOutUser(refreshToken);
  }

  async deleteMe(userId: string, password: string) {
    const success = await this.authRepository.deleteMe(userId, password);
    if (success) {
      return await new Promise<boolean>((res) => {
        rm(`${global.DIR_ROOT}/memes/${userId}`, { recursive: true, force: true }, (err) => {
          if (err) {
            res(false);
          }
          res(true);
        });
      });
    } else {
      return false;
    }
  }
}
