import { TagRepository } from '../repository/tag.repository';

export class TagService {
  private tagRepository: TagRepository;

  constructor() {
    this.tagRepository = new TagRepository();
  }

  async getTags(userId: string) {
    return await this.tagRepository.getTags(userId);
  }

  async createTag(tagName: string, userId: string) {
    if (tagName != null) {
      const savedTag = await this.tagRepository.getTag(tagName.toLowerCase());
      if (savedTag === null) {
        return await this.tagRepository.createTag(tagName, userId);
      } else {
        return savedTag;
      }
    }
  }
}
