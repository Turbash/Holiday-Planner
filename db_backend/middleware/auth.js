const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');

const isLoggedIn=(req,res,next)=>{
    const token=req.cookies.token
    if(!token){
        return res.status(401).send("Unauthorized");
    }
    try{
        req.user=jwt.verify(token,process.env.JWT_SECRET_KEY);
        next();
    }catch{
        res.status(401).send("Invalid token");
    }
}

module.exports=isLoggedIn;