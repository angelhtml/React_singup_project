

export default function Home({userData}){
    //console.log(userData)
    return(
        <div className="homeContainer">
            {userData?.data ? 
                <>
                    <h1>Welocom to home screen 
                        <u style={{color:"purple"}}> {userData?.data?.name}</u>
                    </h1>
                    <p>Your email is: <u style={{color:"purple"}}>{userData?.data?.email}</u></p>
                </>
                :
                <h1>Please login or signup to visit the website</h1>
            }
        </div>
    )
}