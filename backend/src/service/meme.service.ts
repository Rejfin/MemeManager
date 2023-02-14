import { Tag } from '../models/tag.model';
import { MemeRepository } from '../repository/meme.repository';

export class MemeService {
  private memeRepository: MemeRepository;

  constructor() {
    this.memeRepository = new MemeRepository();
  }

  async getMemes(userId: string, latest: boolean, limit: number, page: number) {
    if (latest) {
      return await this.memeRepository.getLatestMemes(userId);
    } else {
      return await this.memeRepository.getMemes(userId, limit, page);
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
    height: number;
    width: number;
    blurHash: string;
    tags: [];
  }) {
    return await this.memeRepository.createMeme(fileData);
  }

  async getMeme(memeId: string, userId?: string) {
    return await this.memeRepository.getMeme(memeId, userId);
  }

  async getUnindexedAmount(userId: string) {
    return await this.memeRepository.countUnindexed(userId);
  }

  async updateMeme(userId: string, memeId: string, tags: Tag[]) {
    return await this.memeRepository.updateMeme(userId, memeId, tags);
  }

  async getUnindexedMemes(userId: string, limit: number, page: number) {
    return await this.memeRepository.getUnindexedMemes(userId, limit, page);
  }
}
