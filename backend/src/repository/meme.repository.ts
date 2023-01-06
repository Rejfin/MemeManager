import { connect } from "../config/db.config";
import { Meme } from "../models/meme.model";

export class MemeRepository {

    private db: any = {};
    private memeRespository: any;

    constructor() {
        this.db = connect();
        // For Development
        this.db.sequelize.sync({ force: true }).then(() => {
            console.log("Drop and re-sync db.");
        });
        this.memeRespository = this.db.sequelize.getRepository(Meme);
    }

    async getMemes() {
        try {
            const memes = await this.memeRespository.findAll();
            return memes;
        } catch (err) {
            console.log(err);
            return [];
        }
    }
}