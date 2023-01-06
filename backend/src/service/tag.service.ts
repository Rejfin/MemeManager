import { Tag } from '../models/tag.model';
import { TagRepository } from '../repository/tag.repository';

export class TagService {

    private tagRepository: TagRepository;

    constructor() {
        this.tagRepository = new TagRepository();
    }

    async getTags() {
        return await this.tagRepository.getTags();
    }

    async createTag(tag: Tag) {
        if(tag.name != null){
            const savedTag = await this.tagRepository.getTag(tag.name.toLowerCase())
            if(savedTag === null){
                return await this.tagRepository.createTag(tag);
            }else{
                return savedTag
            }
        }
    }
}
