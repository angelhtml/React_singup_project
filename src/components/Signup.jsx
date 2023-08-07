import axios from 'axios';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect,useState } from 'react';
import validator from 'validator';
import { Button, Progress } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import { useNavigate } from "react-router-dom";

export default function Signup(){
  const navigate = useNavigate();
  const toast = useToast()

  const [passwordScore, setPasswordScore] = useState()

  const PasswordValid = (password) => {
    const passwordValid = validator.isStrongPassword(password ,{minLength: 8, returnScore: true})
    setPasswordScore(passwordValid)
  }

  if(passwordScore <= 50){
    var passErorr = <p className='errortxt'>Please enter valid strong password</p>
    var progressBarColor = "red"
  }
  if(passwordScore > 50){
    var progressBarColor = "green"
  }

  const userSchema = yup.object().shape({
    name: yup.string().required(),
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
      url: `http://localhost:3001/signup`,
      data: data,
    })
    .then(function (response) {

      //if user is exist
      if(response.data.msg == "user already is exist"){
        
        toast({
          title: 'Account not created',
          description: "User already is exist",
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
        return navigate('/login');

      }
      // if user wasn't exist
      if(response.data.msg == "user created"){
        localStorage.setItem("userSecret" , response?.headers?.["header_token"])
        toast({
          title: 'Welcome',
          description: "Your account created",
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
        navigate('/');
        window.location.reload();
      }
    }).catch(function (error) {
      console.log(error);
    }) 
  }

  return(
    <div>
      <div className='formContainer'>
          <div className='form'>
            <h1 className='formTitle'>Signup</h1>
            <input {...registeruser("name")} placeholder="Username" type='text'/>
            {errorsuser.name && <p className='errortxt'>Please enter your name</p>}
            <input {...registeruser("email")} placeholder="Email" type='email'/>
            {errorsuser.email && <p className='errortxt'>Your email isn't valid</p>}
            <input {...registeruser("password")} onChange={(v) => PasswordValid(v.target.value) } placeholder="Password" type='password'/>
            {passErorr}
            <div className='progressBar'>
              <Progress value={passwordScore} colorScheme={progressBarColor}/>
            </div>
            <center>
              <p style={{color:"purple",padding:"10px"}}>password score: {passwordScore}</p>
              <button className='Submitbutton' onClick={handleSubmituser(onSubmitHandleruser)}>Submit</button><br />
            </center>
          </div>
      </div>
    
    
    </div>
  )
}

/*
export default function Signup(){
    const [input, setInput] = useState({
        name: '',
        password: ''
      })
    
      function handleChange(event) {
        const {name, value} = event.target;
    
        setInput(prevInput => {
            return{
                ...prevInput,
                [name]: value
            }
        })
      }
    
      function handleClick(event) {
        event.preventDefault();
        axios({
            method: 'post',
            url: 'http://localhost:3001/signup',
            data: {
                name: input.name,
                password: input.password
            },
          }).then(function (response) {
              console.log(response?.headers?.["header_token"]);
              //console.log(response)
              localStorage.setItem("userSecret" , response?.headers?.["header_token"])
            })
            .catch(function (error) {
              console.log(error);
            });
      }
    
      function getClick(){
        axios({
          method: 'get',
          url: 'http://localhost:3001/test',
        }).then(function (response) {
            console.log(response);
            console.log(response?.headers?.["header_token"]);
            //console.log(sessionStorage.getItem("userSecret"))
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    
      return (
        <div>
          <center>
          <input required  name='name' value={input.name} autoComplete='on' placeholder='username' onChange={handleChange}/><br />
          <input required  name='password' value={input.password} autoComplete='on' placeholder='password' onChange={handleChange}/><br />
          <button onClick={handleClick}>Submit</button><br />
          <button onClick={getClick}>GET</button>
          </center>
        </div>
      )
}
*/