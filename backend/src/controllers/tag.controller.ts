import { Tag } from '../models/tag.model';
import { TagService } from '../service/tag.service';

export class TagController {

    private tagService: TagService;

    constructor() {
        this.tagService = new TagService();
    }

    async getTags(userId: string) {
        return await this.tagService.getTags(userId);
    }

    async createTag(tag: string, userId: string) {
        const newTag =  await this.tagService.createTag(tag, userId);
        if(newTag){
            return {id: newTag.id, name: newTag.name}
        }else{
            return null
        }
    }
}