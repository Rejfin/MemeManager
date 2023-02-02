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
}
