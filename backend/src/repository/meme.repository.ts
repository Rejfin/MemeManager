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

  async getLatestMemes(userId: string): Promise<Meme[]>{
    try{
      const memes = await this.memeRepository.findAll({
        where: {userId: userId, },
        limit: 10,
        order: [ [ 'uploadDate', 'DESC' ]],
        include: [
          {
            model: this.tagRepository,
            attributes: ["id", "name"],
            through: { attributes: [] },
          },
        ],
        attributes: {exclude: ['userId']}
      })
      return memes;
    }catch(err){
      return [];
    }
  }

  async getMemes(userId: string, limit: number, page: number) {
    try {
      const memes = await this.memeRepository.findAndCountAll({
        where: { userId: userId },
        limit: limit,
        offset: page * limit,
        order: [[ 'modifiedDate', 'DESC' ]],
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
    modifiedDate: Date;
    tags: [];
  }): Promise<Meme> {
    const meme = await this.memeRepository.create(fileData);
    if (fileData.tags) {
      fileData.tags.forEach((data) => {
        meme.$add("tags", data);
      });
    }
    return meme;
  }

  async getMeme(memeId: string, userId?: string): Promise<Meme>{
    if(userId){
      return await this.memeRepository.findOne({where: {userId: userId, id: memeId}})
    }else{
      return await this.memeRepository.findOne({where: {id: memeId}})
    }
  }
}
