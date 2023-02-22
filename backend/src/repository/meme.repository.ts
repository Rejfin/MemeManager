import { col, fn, literal } from 'sequelize';
import { connect } from '../config/db.config';
import { Meme } from '../models/meme.model';
import { Tag } from '../models/tag.model';

export class MemeRepository {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  private db: any = {};
  private memeRepository: any;
  private tagRepository: any;
  /* eslint-enable @typescript-eslint/no-explicit-any */

  constructor() {
    this.db = connect();
    this.memeRepository = this.db.sequelize.getRepository(Meme);
    this.tagRepository = this.db.sequelize.getRepository(Tag);
  }

  async getMemes(userId: string, limit: number, page: number, latest?: boolean, tagList?: number[]) {
    try {
      const memes = await this.memeRepository.findAndCountAll({
        where: { userId: userId },
        limit: limit,
        offset: page * limit,
        include: [
          {
            model: this.tagRepository,
            attributes: ['id', 'name'],
            through: { attributes: [] },
            where: tagList && tagList?.length > 0 ? { id: tagList } : null,
          },
        ],
        order: [[latest ? 'uploadDate' : 'modifiedDate', 'DESC']],
        attributes: ['blurHash', 'width', 'height', 'id', 'modifiedDate', 'originalName', 'size', 'uploadDate', 'type'],
      });
      return memes;
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  async createMeme(fileData: {
    userId: string;
    name: string;
    originalName: string;
    type: string;
    size: number;
    uploadDate: Date;
    modifiedDate: Date;
    blurHash?: string;
    thumbnailName?: string;
    width?: number;
    height?: number;
    tags: [];
  }): Promise<Meme> {
    const meme = await this.memeRepository.create(fileData);
    if (fileData.tags) {
      fileData.tags.forEach((data) => {
        meme.$add('tags', data);
      });
    }
    return meme;
  }

  async getMeme(memeId: string, userId?: string): Promise<Meme> {
    if (userId) {
      return await this.memeRepository.findOne({
        where: { userId: userId, id: memeId },
        include: [
          {
            model: this.tagRepository,
            attributes: ['id', 'name'],
            through: { attributes: [] },
          },
        ],
      });
    } else {
      return await this.memeRepository.findOne({
        where: { id: memeId },
      });
    }
  }

  async countUnindexed(userId: string): Promise<number> {
    return await this.memeRepository.count({
      where: literal(`Tags IS NULL AND "Meme"."userId" = '${userId}'`),
      include: [
        {
          model: this.tagRepository,
        },
      ],
    });
  }

  async updateMeme(userId: string, memeId: string, tags: Tag[]) {
    const meme = await this.memeRepository.findOne({
      where: { id: memeId, userId: userId },
      include: [{ model: this.tagRepository }],
    });
    if (meme) {
      const newTags: Tag[] = [];
      for (const tag of tags) {
        const [mTag] = await this.tagRepository.findOrCreate({
          where: { name: tag.name, userId: userId },
          defaults: {
            name: tag.name,
          },
        });

        if (!newTags.find((tag) => tag.id === mTag.id)) {
          newTags.push(mTag);
        }
      }
      await meme.setTags(newTags);

      return await this.memeRepository.findByPk(memeId, {
        attributes: { exclude: ['userId'] },
        include: [{ model: this.tagRepository, attributes: ['id', 'name'], through: { attributes: [] } }],
      });
    } else {
      return null;
    }
  }

  async getUnindexedMemes(userId: string, limit: number, page: number) {
    try {
      const memes = this.memeRepository.findAll({
        where: literal(
          `Tags IS NULL AND "Meme"."userId" = '${userId}' GROUP BY "Meme"."modifiedDate", "Meme"."id", "tags"."id" ORDER BY "Meme"."modifiedDate" DESC LIMIT ${limit} OFFSET ${
            page * limit
          }`,
        ),
        include: [
          {
            model: this.tagRepository,
            attributes: ['id', 'name'],
            through: { attributes: [] },
          },
        ],
      });
      const [memeList, count] = await Promise.all([memes, this.countUnindexed(userId)]);

      return { count: count, rows: memeList, currentPage: 0, nextPage: 0, maxPage: 0 };
    } catch (err) {
      console.log(err);
      return { count: 0, rows: [], currentPage: 0, nextPage: 0, maxPage: 0 };
    }
  }

  async getStatistics(
    userId: string,
  ): Promise<{ sizes: { type: string; size: string }[]; counts: { type: string; count: string }[] }> {
    const sizeData = this.memeRepository.findAll({
      where: { userId: userId },
      group: ['type'],
      raw: true,
      attributes: ['type', [fn('sum', col('size')), 'size']],
    });
    const countData = this.memeRepository.findAll({
      where: { userId: userId },
      group: ['type'],
      raw: true,
      attributes: ['type', [fn('COUNT', col('id')), 'count']],
    });
    return Promise.all([sizeData, countData]).then((data) => {
      return {
        sizes: data[0],
        counts: data[1],
      };
    });
  }
}
