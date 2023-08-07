var jwt = require('jsonwebtoken');
require('dotenv').config()

const secret = process.env.SECRET

const Verify = async (usertoken) => {
    try{
        if(!usertoken){
            return {success:false, message: "Error! Token was not provided."}
        }
        else{
            const decoded = jwt.verify(usertoken, secret)
            //console.log(decoded)
            return {
                success:true, 
                data:{
                    _id:decoded._id,
                    name:decoded.name,
                    email:decoded.email,
                    join_date:decoded.iat
                }
            }
            //if(decoded == undefined){console.log("nope")}
            //return {success:true, msg: decoded}
        }
        //const userToken = req.params.Token
        //if(!userToken){
        //    res.status(200).json({success:false, message: "Error! Token was not provided."});
        //}
        //const decoded = await jwt.verify(userToken, secret)
        //console.log(decoded)
        //res.send({userToken: userToken, decoded: decoded})
    } 
    catch(err){ new Error(err)}
}

exports.Verify = Verify