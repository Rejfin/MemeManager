import { Sequelize } from 'sequelize-typescript';
import { Meme } from '../models/meme.model';
import { RefreshToken } from '../models/refreshToken.model';
import { Tag } from '../models/tag.model';
import { TagMeme } from '../models/tagMeme.model';
import { User } from '../models/user.model';

export const connect = () => {
  const hostName = process.env.PG_HOST || 'db';
  const userName = process.env.PG_USER || 'postgres';
  const password = process.env.PG_PASSWORD || 'postgres';
  const database = process.env.PG_DB || 'meme-manager';
  const dialect = 'postgres';

  const sequelize = new Sequelize(database, userName, password, {
    host: hostName,
    dialect: dialect,
    repositoryMode: true,
    pool: {
      max: 10,
      min: 0,
      acquire: 20000,
      idle: 5000,
    },
  });

  sequelize.addModels([Meme, Tag, TagMeme, User, RefreshToken]);
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const db: any = {};
  db.Sequelize = Sequelize;
  db.sequelize = sequelize;

  return db;
};
