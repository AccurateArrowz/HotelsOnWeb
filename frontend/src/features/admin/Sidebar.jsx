import React from 'react'
import { useNavigate } from 'react-router-dom'

const mappings = [
  {id: 1, 
    label: 'dashboard', 
    route: '/admin/dashboard'
  }, 
    {id: 2, 
    label: 'users', 
    route: '/admin/users'
  },
    {id: 3, 
    label: 'Hotel Requests', 
    route: '/admin/hotel-requests'
  }
]

export default function Sidebar() {
  const navigate = useNavigate();
  return (
    <div className='w-[20vw] h-full border border-red-100 flex flex-col gap-[16px]'>
      {mappings.map(mapping=> (
        <button onClick={()=> (navigate(mapping.route))}>{mapping.label}</button>
      ))}

    </div>
  )
}

