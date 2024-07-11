import React from 'react'
import logo from "../../img/icon.png"
import "./Header.css"
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <div className="header">
      <div>

      <img src={logo} alt="Logo" className='icon' style={{ width: '85px', height: '85px' }} />
      </div>

      {/* <div>
        <Link style={{color: "white"}} to={"/support"}>Get Support</Link>
      </div> */}

      <div>
        <a href='https://play.google.com/store/apps/details?id=com.aaonisaalive'><button className='install-now'>Get the App</button></a>
      </div>
    </div>
  )
}

export default Header