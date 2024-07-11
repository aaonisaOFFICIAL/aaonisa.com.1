import React from 'react'
import "./Footer.css"

const Footer = ({ profile, username }) => {
  return (
    <div className='footer'>
      <img src={profile} alt="Profile" />
      <p>{username}</p>
    </div>
  )
}

export default Footer
