var validator = require('validator');
const table = require('cakebase');
const { Verify } = require('./verify');
var jwt = require('jsonwebtoken');
require('dotenv').config()

const secret = process.env.SECRET
const expired_token = process.env.EXPIRED_JWT

const Login = async (req, res) => {
    try{
        const {email, password} = req.body

        //Email validation
        if(validator.isEmail(email)){

            const users = table("./users.json");
            const user_exist = await users.get(obj => obj.email === email);

            //if user doesn't exist in database, shoulbe be create new account in signup page
            if(user_exist[0] == undefined){
                res.send("redirect user to signup page") //an issue is here =================================================<<<<
                //res.redirect(`${process.env.DOMAIN_NAME}/signup`)
            }
            //if user exist in database
            if(user_exist){

                //check the password
                if(user_exist[0].password === password){

                    //check the user token
                    const result = await Verify(user_exist[0].token)
                    //if user's token didn't verified or expired
                    if(result == undefined){
                        
                        //create a new token for user
                        const new_token = jwt.sign({
                            name: user_exist[0]?.name,
                            email: user_exist[0]?.email,
                            password: user_exist[0]?.password
                        }, secret, { expiresIn: expired_token });

                        //replace the new token in database
                        await users.update(obj => obj.email === email, { token: new_token });

                        const user_schema = { 
                            _id: user_exist[0]?._id,
                            name: user_exist[0]?.name, 
                            email: user_exist[0]?.email, 
                            email_verify: user_exist[0]?.email_verify,
                            admin: user_exist[0]?.admin,
                            join_date: user_exist[0]?.join_date,
                        }
                        //full access for getting the header in client
                        res.header("Access-Control-Expose-Headers", "*")
                        res.set("header_token", new_token)
                        res.send(user_schema)

                    }
                    //if user's token was verified
                    else{
                        res.header("Access-Control-Expose-Headers", "*")
                        res.set("header_token", user_exist[0].token)
                        res.send(
                            { 
                                _id: user_exist[0]?._id,
                                name: user_exist[0]?.name, 
                                email: user_exist[0]?.email, 
                                email_verify: user_exist[0]?.email_verify,
                                admin: user_exist[0]?.admin,
                                join_date: user_exist[0]?.join_date,
                            }
                        )
                    }

                }

                else{res.send("Your password is wrong")}

            }
 
        }
        else{
            res.send("your email is incorrect")
        }

    } 
    catch(err){new Error(err)}
}

exports.Login = Login