import { connect } from "../config/db.config";
import { RefreshToken } from "../models/refreshToken.model";
import { User } from "../models/user.model";
const bcrypt = require('bcrypt');

export class AuthRepository {

    private db: any = {};
    private authRespository: any;
    private tokenRepository: any

    constructor() {
        this.db = connect();
        this.authRespository = this.db.sequelize.getRepository(User);
        this.tokenRepository = this.db.sequelize.getRepository(RefreshToken);
    }

    async registerUser(user: User) {
        const mUser = await this.authRespository.findOne({ where: { login: user.login } })
        if(mUser){
            return {created: false}
        }

        const data = await this.authRespository.create(user)
        return {created: true}
    }

    async signinUser(user: User){
        const mUser = await this.authRespository.findOne({ where: { login: user.login } })
        if(mUser){
            return await bcrypt.compare(user.password, mUser.password);
        }else{
            return false;
        }
    }

    async saveTokenToUser(token: RefreshToken, user: User){
        const mUser = await this.authRespository.findOne({ where: { login: user.login } })
        const mToken = await this.tokenRepository.create({token: token, userId: mUser.id})
        mUser.$add('tokens', mToken.id)
    }

    async findRefreshToken(token: string){
        const mRefreshToken = await this.tokenRepository.findOne({where: {token: token}})
        return mRefreshToken
    }
}