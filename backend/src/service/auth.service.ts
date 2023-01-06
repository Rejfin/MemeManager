import { User } from "../models/user.model";
import { AuthRepository } from "../repository/auth.repository";
const jwt = require("jsonwebtoken");

export class AuthService {
  private authRepository: AuthRepository;

  constructor() {
    this.authRepository = new AuthRepository();
  }

  async registerUser(user: User) {
    if (user.login && user.password) {
      return await this.authRepository.registerUser(user);
    } else {
      return null;
    }
  }

  async signInUser(user: User) {
    if (user.login && user.password) {
      return await this.authRepository.signinUser(user);
    } else {
      return false;
    }
  }

  async createRefreshToken(payload: object, user: User): Promise<string> {
    const REFRESH_TOKEN = process.env.TOKEN_REFRESH_SECRET;
    const REFRESH_EXP = process.env.JWT_REFRESH_EXP;
    const token = jwt.sign(payload, REFRESH_TOKEN, { expiresIn: REFRESH_EXP });
    await this.authRepository.saveTokenToUser(token, user);
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
    if(!mRefreshToken){
      return null
    }
    const REFRESH_TOKEN = process.env.TOKEN_REFRESH_SECRET;
    jwt.verify(refreshToken, REFRESH_TOKEN, (err: any, data: any) => {
      if (err) {
        return null;
      }
      return this.createJwtToken(data)
    });
    return null;
  }
}
