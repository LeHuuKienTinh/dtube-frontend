import React from 'react'
import './ReportAdmin.scss'
import MenuReport from '../reportManage/MenuReport'
import { Outlet } from 'react-router-dom'
const ReportAdmin = () => {
  return (
    <div className='report-wrapper'>
      <h2 className='title-manage-report'>Quản lý Báo cáo</h2>
      <MenuReport />
      <Outlet />
    </div>
  )
}

export default ReportAdmin
