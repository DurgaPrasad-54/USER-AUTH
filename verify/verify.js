const jwt = require("jsonwebtoken");
const dotenv = require('dotenv')
dotenv.config()


function verify(req,res,next){
    const auth = req.headers['authorization'];
    try{
        if(!auth){
            res.send({message:"Header is missing"});
        }
        Token = auth.split(' ')[1];
        if(!Token){
            res.send({message:"Token is missing"});
        }
        else{
            jwt.verify(Token,process.env.TOKEN,(err,decode)=>{
                if(err){
                    res.send({message:"Invalid Token"});
                }
                else{
                    req.user=decode;
                    next();
                }
            })
        }

        

    }
    catch(err){
        res.send({error:err})
    }
}

module.exports = verify ;