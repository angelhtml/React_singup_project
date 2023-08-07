var jwt = require('jsonwebtoken');
var validator = require('validator');
const table = require('cakebase');
require('dotenv').config()

const secret = process.env.SECRET
const expired_token = process.env.EXPIRED_JWT

const Signup = async (req, res) => {
    try{
        const {name,email,password} = req.body
        if(name){
            if(validator.isEmail(email)){
                if(validator.isStrongPassword(password ,{minLength: 8})){

                    const users = table("./users.json");
                    const user_exist = await users.get(obj => obj.email === email);

                    if(user_exist[0] == undefined){

                        const user_id = Date.now() * Math.floor(Math.random() * 100)

                        var token = await jwt.sign({
                            _id: user_id,
                            name: name, 
                            email: email, 
                            password: password,
                            join_date: Date.now(),
                        }, secret, { expiresIn: expired_token });

                        const user_schema = { 
                            _id: user_id,
                            name: name, 
                            email: email, 
                            password: password,
                            email_verify: false,
                            admin: false,
                            join_date: Date.now(),
                            token: token 
                        }

                        await users.set(user_schema);

                        //full access for getting the header in client
                        res.header("Access-Control-Expose-Headers", "*")
                        res.set("header_token", token)
                        res.send({msg: "user created"})

                    }
                    else{
                        res.send({msg: "user already is exist"})
                    }
                    
                }
                else{
                    res.send({msg: 'your password is not strong'})
                }
            }
            else{
                res.send({msg: "your email is incorrect"})
            }
        }
        else{
            res.send({msg: "Please enter your name"})
        }
        //console.log(validator.isEmail(email))
        //console.log(validator.isStrongPassword(password ,{minLength: 8}))
        //var token = await jwt.sign(req.body, secret, { expiresIn: '7d' });
        //full access for getting the header in client
        //res.header("Access-Control-Expose-Headers", "*")
        //res.set("header_token", token)
        //res.send({msg: "signed"})
    } 
    catch(err){ console.log(err)}
}

exports.Signup = Signup