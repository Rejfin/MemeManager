export const validatorMiddleware = (requiredFields: string[]) => {
    return (req: any, res: any, next: any) => {
        for(let field of requiredFields){
            if(!Object.hasOwn(req.body, field)){
                return res.sendStatus(400);
            }
        }
        next();
    }
  }