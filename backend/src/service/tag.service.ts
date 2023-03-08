import { TagRepository } from '../repository/tag.repository';

export class TagService {
  private tagRepository: TagRepository;

  constructor() {
    this.tagRepository = new TagRepository();
  }

  async getTags(userId: string, tagName: string, page: number, limit: number) {
    return await this.tagRepository.getTags(userId, tagName, limit, page);
  }

  /**
   * creates new tag if tag with provided name does not exist in databse jet
   */
  async createTag(tagName: string, userId: string) {
    if (tagName != null) {
      const savedTag = await this.tagRepository.getTag(tagName.toLowerCase());
      if (savedTag === null) {
        return await this.tagRepository.createTag(tagName, userId);
      } else {
        return savedTag;
      }
    } else {
      return null;
    }
  }

  async removeTag(tagId: number, userId: string) {
    return await this.tagRepository.removeTag(tagId, userId);
  }
}
