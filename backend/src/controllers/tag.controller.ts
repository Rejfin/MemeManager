import { TagService } from '../service/tag.service';

export class TagController {
  private tagService: TagService;

  constructor() {
    this.tagService = new TagService();
  }

  async getTags(req: { user: { userId: string }; query: { limit?: number; page?: number; name?: string } }) {
    let limit = req.query.limit || 10;
    let page = req.query.page || 0;
    page = page * 1;
    limit = limit * 1;
    const name = req.query.name || '';
    const tagsList = await this.tagService.getTags(req.user.userId, name, page, limit);
    tagsList.currentPage = page;
    tagsList.nextPage = tagsList.count - (page + 1) * limit > 0 ? page + 1 : Math.ceil(tagsList.count / limit) - 1;
    tagsList.maxPage = Math.ceil(tagsList.count / limit) - 1;
    if (tagsList.nextPage < 0) {
      tagsList.nextPage = 0;
    }
    return tagsList;
  }

  async createTag(tag: string, userId: string) {
    const newTag = await this.tagService.createTag(tag, userId);
    if (newTag) {
      return { id: newTag.id, name: newTag.name };
    } else {
      return null;
    }
  }
}
