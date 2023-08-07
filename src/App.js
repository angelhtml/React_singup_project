
import { useState } from 'react'
import axios from 'axios'
import {
  BrowserRouter as Router,
  Route, Routes
} from 'react-router-dom';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Signup from './components/Signup';
import Login from './components/Login';
import { useEffect } from 'react';

export default function App() {

  const [userData, setUserData] = useState()

  //conditional's view
  const [isView, setIsView] = useState({Visible: true})

  var userSecret = localStorage.getItem("userSecret")

  //post user token from local storage to server with header
  useEffect(() =>{

    axios({
      method: 'post',
      url: 'http://localhost:3001/verify',
      headers:{
        token: userSecret
      },
    }).then(function (res){

        //console.log(res.data)
        setUserData(res.data)

        //if token verify was unsuccessfull
        if(res?.data?.success == false){
          localStorage.removeItem("userSecret");
          setIsView({Visible: false})
        }

      }).catch(function (err){
        console.log(err)
      })
    //console.log(userSecret)

  },[])

  return (
    <div>
      <Navbar isView={isView}/>
      <Routes>
      
      <Route path="/" element={ <Home userData={userData}/> } />
      <Route path="signup" element={ <Signup/> } />
      <Route path='login' element={<Login />}/>
    </Routes>
    </div>

  )
}
