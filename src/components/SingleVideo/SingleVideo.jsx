import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../config'
import Header from '../Header/Header'
import Video from '../Video/Video'
import "./SingleVideo.css"
import "../../App.css"

const SingleVideo = () => {
    const [video, setVideo] = useState([])

    const { id } = useParams()

    const getData = async() => {
        try{
            const data = collection(db ,"videos")
            const q = query(data, where("id", "==", id))
            const querySnapshot = await getDocs(q)

            const dataInRange = querySnapshot.docs.map((doc) => doc.data());
            setVideo(dataInRange)
        }
        catch(err){

            console.error(err)
        }
    }

    useEffect(() => {
        getData()
    })
    
  return (
    <div className="App">
        <Header />
        <center>
          <div className="video-container" id="video-container">
            {video.map((data) => (
              <Video
                key = {data.id}
                url = {data.videoUrl}
                username = {data.username}
                profile = {data.profile}
                likes = {data.likes}
                comment = {data.commentCount}
                share = {data.shareCount}
              />  
            ))}
          </div>
        </center>
      </div>
  )
}

export default SingleVideo