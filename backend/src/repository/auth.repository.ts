import { connect } from '../config/db.config';
import { RefreshToken } from '../models/refreshToken.model';
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';

export class AuthRepository {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  private db: any = {};
  private authRespository: any;
  private tokenRepository: any;
  /* eslint-enable @typescript-eslint/no-explicit-any */

  constructor() {
    this.db = connect();
    this.authRespository = this.db.sequelize.getRepository(User);
    this.tokenRepository = this.db.sequelize.getRepository(RefreshToken);
  }

  async registerUser(user: { login: string; password: string }) {
    const mUser = await this.authRespository.findOne({ where: { login: user.login } });
    if (mUser) {
      return { created: false };
    }

    await this.authRespository.create(user);
    return { created: true };
  }

  async signinUser(user: { login: string; password: string }) {
    const mUser = await this.authRespository.findOne({ where: { login: user.login } });
    if (mUser) {
      const isPassOk = await bcrypt.compare(user.password, mUser.password);
      if (isPassOk) {
        return mUser;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  async saveTokenToUser(token: string, userId: string) {
    const user = await this.authRespository.findOne({ where: { id: userId } });
    const mToken = await this.tokenRepository.create({ token: token, userId: userId });
    user.$add('tokens', mToken.id);
  }

  async findRefreshToken(token: string) {
    const x = await this.tokenRepository.findOne({ where: { token: token } });
    console.log(x);

    return x;
  }

  async signOutUser(token: string) {
    const rToken = await this.tokenRepository.findOne({ where: { token: token } });
    await rToken.destroy();
  }

  async deleteMe(userId: string, password: string): Promise<boolean> {
    const mUser = await this.authRespository.findOne({ where: { id: userId } });
    if (mUser) {
      const isPassOk = await bcrypt.compare(password, mUser.password);
      if (isPassOk) {
        await this.authRespository.destroy({ where: { id: userId } });
        return true;
      } else {
        return false;
      }
    }
    return false;
  }
}
