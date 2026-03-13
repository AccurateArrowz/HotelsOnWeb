import React from 'react'

export default function RoughProtected({children, role, redirectTo='/', openLoginModal}) {
    const {user} = useAuth(); 
    if(user === null) {openLoginModal()}
    else if(user.role !=== role) return <p>Unauthorized to access this route</p>
    else{
        return <>{children}</>
    }
  
  
}

