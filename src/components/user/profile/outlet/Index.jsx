import React from 'react'
import { useAuth } from '../../../../contexts/AuthProvider'
import './Index.scss'
const Index = () => {
  const { user } = useAuth()

  return (
    <div className="account-index">
      <h1>Xin chào, {user.name}!</h1>
      <p>Email: {user.username}</p>

      {user.type == 1 ? (
        <div className="admin-section">
          <h2>Quản trị viên</h2>
        </div>
      ) : (
        <div className="user-section">
          <h2>Thành viên thông thường</h2>
        </div>
      )}
    </div>
  )
}

export default Index
