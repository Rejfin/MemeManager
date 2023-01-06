import { User } from '../models/user.model';
import { AuthService } from '../service/auth.service';

export class AuthController {

    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    async registerUser(user: User, res: any) {
        const data =  await this.authService.registerUser(user);
        if (data == null) {
            res.sendStatus(400);
          } else {
            if (data?.created == true) {
              res.sendStatus(201);
            } else {
              res.status(403).send("user already exist");
            }
          }
    }

    async signInUser(user: User, res: any){
        const isLoginSuccess = await this.authService.signInUser(user);
        
        if(isLoginSuccess){
            const token = this.authService.createJwtToken(user);
            const refreshToken = await this.authService.createRefreshToken(user, user);
            res.status(200).json({token: token, refreshToken: refreshToken});
        }else{
            res.sendStatus(401);
        }
    }

    async refreshAccessToken(data: any, res: any){
      const refreshToken = data.token

      if(refreshToken){
        const newToken = await this.authService.renewAccessToken(refreshToken)
        if(newToken){
          res.status(200).send({token: newToken})
        }else{
          res.sendStatus(401)
        }
      }else{
        res.sendStatus(401)
      }
    }
}