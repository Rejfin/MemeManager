const jwt = require("jsonwebtoken");

export const authMiddleware = (req: any, res: any, next: any) => {
  const token = req.headers['authorization']?.split(' ')[1]
  if(!token){
    return res.sendStatus(401);
  }
  const ACCESS_TOKEN = process.env.TOKEN_SECRET
  jwt.verify(token, ACCESS_TOKEN, (err: any, data: any)=>{
    if(err){
      return res.sendStatus(403)
    }

    req.user = data;
    next();
  })
}