import axios from 'axios';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect,useState } from 'react';
import validator from 'validator';
import { useNavigate } from "react-router-dom";
import { useToast } from '@chakra-ui/react'

export default function Login(){
    const toast = useToast()
    const navigate = useNavigate();
    const [passwordScore, setPasswordScore] = useState()

    const PasswordValid = (password) => {
        const passwordValid = validator.isStrongPassword(password ,{minLength: 8, returnScore: true})
        setPasswordScore(passwordValid)
    }

    if(passwordScore <= 50){
        var passErorr = <p className='errortxt'>Please enter valid strong password</p>
    }

    const userSchema = yup.object().shape({
        email: yup.string().email().required(),
        password: yup.string().required('No password provided.') 
        .min(8, 'Password is too short - should be 8 chars minimum.')
    });

    const { register:registeruser, handleSubmit:handleSubmituser, formState: { errors:errorsuser }, reset:resetuser } = useForm({
        resolver: yupResolver(userSchema),
      });
    
      //post the data
      const onSubmitHandleruser = (data) => {
        //console.log(data)
        axios({
          method: 'post',
          url: `http://localhost:3001/login`,
          data: data,
        })
        .then(function (response) {
          //console.log(response.data)

          //if user didn't any account
          if(response.data === "redirect user to signup page"){
            toast({
              title: 'You don`t have any account',
              description: "Please create an account",
              status: 'error',
              duration: 9000,
              isClosable: true,
            })
            return navigate("/signup")
          }

          //if password was wrong
          if(response.data === "Your password is wrong"){
            toast({
              title: 'Login faild',
              description: "Your password is wrong",
              status: 'error',
              duration: 9000,
              isClosable: true,
            })
          }

          //if email was incorrect
          if(response.data === "your email is incorrect"){
            toast({
              title: 'Login faild',
              description: "Your email is incorrect",
              status: 'error',
              duration: 9000,
              isClosable: true,
            })
          }

          if(response.data?.name){
            localStorage.setItem("userSecret" , response?.headers?.["header_token"])
            navigate("/")
            return window.location.reload();
          }


        }).catch(function (error) {
          console.log(error);
        }) 
      }

    return(
      <div className='formContainer'>
        <div className='form'>
          <h1 className='formTitle'>Login</h1>
            <input {...registeruser("email")} placeholder='email' type="email"/>
            {errorsuser.email && <p className='errortxt'>Your email isn't valid</p>}
            <input {...registeruser("password")} onChange={(v) => PasswordValid(v.target.value)} placeholder='password' type="password"/>
            <p className='errortxt'>{passErorr}</p>
            <center>
              <button className='Submitbutton' onClick={handleSubmituser(onSubmitHandleruser)}>Submit</button> 
            </center>
        </div>
      </div>
        
    )
}