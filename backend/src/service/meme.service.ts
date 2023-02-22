import { Tag } from '../models/tag.model';
import { MemeRepository } from '../repository/meme.repository';

export class MemeService {
  private memeRepository: MemeRepository;

  constructor() {
    this.memeRepository = new MemeRepository();
  }

  async getMemes(userId: string, limit: number, page: number, latest?: boolean, tagList?: number[]) {
    return await this.memeRepository.getMemes(userId, limit, page, latest, tagList);
  }

  async createMeme(fileData: {
    userId: string;
    name: string;
    originalName: string;
    type: string;
    size: number;
    uploadDate: Date;
    modifiedDate: Date;
    height?: number;
    width?: number;
    blurHash?: string;
    thumbnailName?: string;
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

  async getStatistics(userId: string) {
    const dbData = await this.memeRepository.getStatistics(userId);
    const sizes = new Map();
    const counts = new Map();

    dbData['sizes'].forEach((data, index) => {
      const type = data.type.split('/');
      if (type[0] === 'image' || type[0] == 'video') {
        sizes.set(type[0], (sizes.get(type[0]) || 0) + Number(data.size));
        counts.set(type[0], (counts.get(type[0]) || 0) + Number(dbData['counts'][index]['count']));
      } else {
        sizes.set('other', (sizes.get('other') || 0) + Number(data.size));
        counts.set('other', (counts.get('other') || 0) + Number(dbData['counts'][index]['count']));
      }
    });

    return { sizes: Object.fromEntries(sizes), counts: Object.fromEntries(counts) };
  }
}
