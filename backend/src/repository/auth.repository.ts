import { connect } from '../config/db.config';
import { RefreshToken } from '../models/refreshToken.model';
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';
import logger from '../config/logger';
import { Repository } from 'sequelize-typescript';
import { Meme } from '../models/meme.model';
import { Tag } from '../models/tag.model';

export class AuthRepository {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  private db: any = {};
  private authRespository: Repository<User>;
  private tokenRepository: Repository<RefreshToken>;
  private memeRepository: Repository<Meme>;
  private tagRepository: Repository<Tag>;
  /* eslint-enable @typescript-eslint/no-explicit-any */

  constructor() {
    this.db = connect();
    this.authRespository = this.db.sequelize.getRepository(User);
    this.tokenRepository = this.db.sequelize.getRepository(RefreshToken);
    this.memeRepository = this.db.sequelize.getRepository(Meme);
    this.tagRepository = this.db.sequelize.getRepository(Tag);
  }

  async registerUser(user: { login: string; password: string }) {
    try {
      const mUser = await this.authRespository.findOne({ where: { login: user.login } });
      if (mUser) {
        return { created: false };
      }

      await this.authRespository.create(user);
      return { created: true };
    } catch (err) {
      logger.error(err);
      return null;
    }
  }

  async signinUser(user: { login: string; password: string }) {
    try {
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
    } catch (err) {
      logger.error(err);
      return null;
    }
  }

  async saveTokenToUser(token: string, userId: string): Promise<boolean> {
    try {
      const user = await this.authRespository.findOne({ where: { id: userId } });
      const mToken = await this.tokenRepository.create({ token: token, userId: userId });
      if (user) {
        user.$add('tokens', mToken.id);
      }
      return true;
    } catch (err) {
      logger.error(err);
      return false;
    }
  }

  async findRefreshToken(token: string): Promise<RefreshToken | null> {
    try {
      return await this.tokenRepository.findOne({ where: { token: token } });
    } catch (err) {
      logger.error(err);
      return null;
    }
  }

  async signOutUser(token: string) {
    try {
      const rToken = await this.tokenRepository.findOne({ where: { token: token } });
      if (rToken) {
        await rToken.destroy();
      }
    } catch (err) {
      logger.error(err);
    }
  }

  async deleteMe(userId: string, password: string): Promise<boolean> {
    try {
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
    } catch (err) {
      logger.error(err);
      return false;
    }
  }

  async cleanAccount(
    userId: string,
    password: string,
  ): Promise<[PromiseSettledResult<number>, PromiseSettledResult<number>] | null> {
    try {
      const mUser = await this.authRespository.findOne({ where: { id: userId } });
      if (mUser) {
        const isPassOk = await bcrypt.compare(password, mUser.password);
        if (isPassOk) {
          return await Promise.allSettled([
            this.memeRepository.destroy({ where: { userId: userId } }),
            this.tagRepository.destroy({ where: { userId: userId } }),
          ]);
        } else {
          return null;
        }
      }
      return null;
    } catch (err) {
      logger.error(err);
      return null;
    }
  }
}
