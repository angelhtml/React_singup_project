import {Link} from 'react-router-dom';
import NavbarStyle from "./Navbar.module.css"
import { useEffect, useState } from 'react';

function Navbar({isView}){
    const [isSigned, setIsSigned] = useState(true)
    //console.log(isView.visible)

    useEffect(() => {
        if(localStorage.getItem("userSecret")){
            console.log("un")
            setIsSigned(false)
        }
        if(isView.visible == false){
            setIsSigned(true)
        }
    },[])
    

    const Logout = () => {
        localStorage.removeItem("userSecret");
        setIsSigned(true)
        console.log('out')
        window.location.reload();
    }
    
    return(
        <div className={NavbarStyle.navbarContainer}>

            <Link className={NavbarStyle.Link} to='/'>Home</Link>

            {isSigned ? 
                <>
                    <Link className={NavbarStyle.Link} to='/signup'>Signup</Link>
                    <Link className={NavbarStyle.Link} to='/login'>Login</Link>
                </>
                :
                <>
                    <Link className={NavbarStyle.Link} onClick={() => Logout()}>Logout</Link>
                </>
            }

        </div>
    )
}
export default Navbar;