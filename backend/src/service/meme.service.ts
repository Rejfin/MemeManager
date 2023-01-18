import { MemeRepository } from "../repository/meme.repository";

export class MemeService {
  private memeRepository: MemeRepository;

  constructor() {
    this.memeRepository = new MemeRepository();
  }

  async getMemes(userId: string, latest: boolean) {
    if(latest){
      return await this.memeRepository.getLatestMemes(userId);
    }else{
      return await this.memeRepository.getMemes(userId);
    }
    
  }

  async createMeme(fileData: {
    userId: string;
    name: string;
    originalName: string;
    type: string;
    size: number;
    uploadDate: Date;
    tags: []
  }) {
    return await this.memeRepository.createMeme(fileData);
  }

  async getMeme(memeId: string, userId?: string){
    return await this.memeRepository.getMeme(memeId, userId);
  }
}


