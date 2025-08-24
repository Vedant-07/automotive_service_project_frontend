import React from 'react'
import {Outlet} from 'react-router-dom'
import Header from '../components/Header'

const AdminLayout = () => {
  return (
    <>
    <Header/>
    <div>
        AdminLayout
        <Outlet />
    </div>
    </>
    
  )
}

export default AdminLayout