import { Tag } from '../models/tag.model';
import { TagService } from '../service/tag.service';

export class TagController {

    private tagService: TagService;

    constructor() {
        this.tagService = new TagService();
    }

    async getTags() {
        return await this.tagService.getTags();
    }

    async createTag(tag: Tag) {
        return await this.tagService.createTag(tag);
    }
}