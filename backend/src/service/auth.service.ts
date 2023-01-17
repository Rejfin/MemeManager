import { User } from "../models/user.model";
import { AuthRepository } from "../repository/auth.repository";
const jwt = require("jsonwebtoken");

export class AuthService {
  private authRepository: AuthRepository;

  constructor() {
    this.authRepository = new AuthRepository();
  }

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
    const REFRESH_TOKEN = process.env.TOKEN_REFRESH_SECRET;
    const REFRESH_EXP = process.env.JWT_REFRESH_EXP;
    const token = jwt.sign(payload, REFRESH_TOKEN, { expiresIn: REFRESH_EXP });
    await this.authRepository.saveTokenToUser(token, userId);
    return token;
  }

  createJwtToken(payload: object): string {
    const ACCESS_TOKEN = process.env.TOKEN_SECRET;
    const TOKEN_EXP = process.env.JWT_EXP;
    const token = jwt.sign(payload, ACCESS_TOKEN, { expiresIn: TOKEN_EXP });
    return token;
  }

  async renewAccessToken(refreshToken: string): Promise<string | null> {
    const mRefreshToken = this.authRepository.findRefreshToken(refreshToken);
    if (!mRefreshToken) {
      return null;
    }
    const REFRESH_TOKEN = process.env.TOKEN_REFRESH_SECRET;
    jwt.verify(refreshToken, REFRESH_TOKEN, (err: any, data: any) => {
      if (err) {
        return null;
      }
      return this.createJwtToken(data);
    });
    return null;
  }
}
