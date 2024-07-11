import React, { useState } from 'react'
import { FaRegHeart, FaHeart,FaComment } from "react-icons/fa";
import { CiShare2 } from "react-icons/ci";
import "./Sidebar.css"

const Sidebar = ({ likes, comments, share }) => {
    const [like, setLike] = useState(false)

    const likeVideo = () => setLike(!like)

  return (
    <div className='sidebar'>
      <div className='likes'>
        {like === true ? (<FaHeart onClick={likeVideo} style={{color:"red"}}/>)  : (<FaRegHeart onClick={likeVideo}/>)}
        <p>{likes.length}</p>
      </div>
      <div className='comment'>
        <FaComment />
        <p>{comments}</p>
      </div>
      <div className='share'>
        <CiShare2 />
        <p>{share}</p>
      </div>
    </div>
  )
}

export default Sidebar
