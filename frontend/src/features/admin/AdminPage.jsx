import React from 'react'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'

export default function AdminPage() {
  return (
    <div>
    {/* <h1>Admin Page</h1> */}
    <Sidebar />
    <Outlet />
    </div>
  )
}
