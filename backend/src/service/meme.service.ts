import { MemeRepository } from '../repository/meme.repository';

export class MemeService {

    private memeRepository: MemeRepository;

    constructor() {
        this.memeRepository = new MemeRepository();
    }

    async getMemes() {
        return await this.memeRepository.getMemes();
    }
}
