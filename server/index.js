const express = require('express');
const app = express();
const cors = require('cors');
const chalk = require('chalk')
const { Signup } = require('./lib/signup');
const { Verify } = require('./lib/verify');
const { Login } = require('./lib/login');
require('dotenv').config()

const secret = process.env.SECRET
const port = 3001

app.use(cors())
app.use(express.json());
app.use(express.static('public'));


app.get("/test", async (req, res) => {
    //console.log(req.header())
    res.header("Access-Control-Expose-Headers", "*")
    res.set("header_token", "take me !!!!!!!!!!!!!!!!!!!!!!!!!!!")
    res.send('...')
})

const VerifyUser = async (req, res) => {
    //console.log(req.headers.token)
    const result = await Verify(req.headers.token)
    //console.log(result)
    if(result == undefined){
        res.send({
            "success": false,
            "data": false
        })
    }
    else{
        res.send(result)
    }
}

app.post("/signup", Signup);
app.post("/verify", VerifyUser)
app.post("/login", Login)

app.listen(process.env.SERVER_PORT, function(){
    console.log(chalk.white.bgGreen.bold(`express server is running on http://localhost:${process.env.SERVER_PORT}`));
}) 