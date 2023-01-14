import { connect } from "../config/db.config";
import { Meme } from "../models/meme.model";
import { Tag } from "../models/tag.model";

export class MemeRepository {
  private db: any = {};
  private memeRepository: any;
  private tagRepository: any;

  constructor() {
    this.db = connect();
    // For Development
    // this.db.sequelize.sync({ force: true }).then(() => {
    //   console.log("Drop and re-sync db.");
    // });
    this.memeRepository = this.db.sequelize.getRepository(Meme);
    this.tagRepository = this.db.sequelize.getRepository(Tag);
  }

  async getMemes(userId: string) {
    try {
      const memes = await this.memeRepository.findAll({
        where: { userId: userId },
        include: [
          {
            model: this.tagRepository,
            attributes: ["id", "name"],
            through: { attributes: [] },
          },
        ],
        attributes: {exclude: ['userId']}
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
    tags: [];
  }) {
    const meme = await this.memeRepository.create(fileData);
    if (fileData.tags) {
      console.log(fileData.tags);

      fileData.tags.forEach((data) => {
        console.log(data);

        meme.$add("tags", data);
      });
    }
    return meme;
  }

  async getMeme(userId: string, memeId: string){
    return await this.memeRepository.findOne({where: {userId: userId, id: memeId}})
  }
}
