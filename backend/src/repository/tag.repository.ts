import { connect } from "../config/db.config";
import { Tag } from "../models/tag.model";

export class TagRepository {

    private db: any = {};
    private tagRespository: any;

    constructor() {
        this.db = connect();
        this.db.sequelize
        this.tagRespository = this.db.sequelize.getRepository(Tag);
    }

    async getTags(userId: string) {
        try {
            const tags = await this.tagRespository.findAll({where: {userId: userId}, attributes: ['id', 'name']});
            return tags;
        } catch (err) {
            console.log(err);
            return [];
        }
    }

    async getTag(tagName: string) {
        try {
            return await this.tagRespository.findOne({where: {name: tagName}});
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    async createTag(tagName: string, userId: string) {
        let data = {}
        try {
            data = await this.tagRespository.create({name: tagName, userId: userId});
        } catch(err) {
            console.log(err)
        }
        return data;
    }
}