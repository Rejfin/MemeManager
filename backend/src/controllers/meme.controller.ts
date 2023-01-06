import { MemeService } from '../service/meme.service';

export class MemeController {

    private memeService: MemeService;

    constructor() {
        this.memeService = new MemeService();
    }

    async getMemes() {
        return await this.memeService.getMemes();
    }
}