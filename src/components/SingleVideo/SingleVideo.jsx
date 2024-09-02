import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy, startAfter, limit } from 'firebase/firestore';
import { db } from '../../config';
import Header from '../Header/Header';
import Video from '../Video/Video';
import './SingleVideo.css';
import '../../App.css';

const SingleVideo = () => {
  const [videos, setVideos] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();  // Replacing useHistory with useNavigate

  const getData = async (startAtDoc = null) => {
    if (loading) return;
    setLoading(true);

    const videosRef = collection(db, 'videos');
    let q;

    if (startAtDoc) {
      q = query(
        videosRef,
        orderBy('date'),
        startAfter(startAtDoc),
        limit(10)
      );
    } else {
      q = query(
        videosRef,
        where('id', '==', id),
        limit(1)
      );
    }

    const querySnapshot = await getDocs(q);
    const fetchedVideos = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    if (!startAtDoc && fetchedVideos.length > 0) {
      const initialVideo = fetchedVideos[0];
      const allVideosQuery = query(
        videosRef,
        where('type', '==', 'video'),
        orderBy('date'),
        startAfter(querySnapshot.docs[0]),
        limit(9)
      );

      const additionalVideosSnapshot = await getDocs(allVideosQuery);
      const additionalVideos = additionalVideosSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      setVideos([initialVideo, ...additionalVideos]);
      setLastVisible(additionalVideosSnapshot.docs[additionalVideosSnapshot.docs.length - 1]);
    } else {
      setVideos((prevVideos) => [...prevVideos, ...fetchedVideos]);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
    }

    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [id]);

  const handleScroll = () => {
    const videoContainer = document.getElementById('video-container');
    if (videoContainer) {
      const scrollPosition = videoContainer.scrollTop + videoContainer.offsetHeight;
      const height = videoContainer.scrollHeight;

      if (scrollPosition >= height - 200) {
        getData(lastVisible);
      }

      const currentVideoIndex = Math.floor(scrollPosition / window.innerHeight);
      if (videos[currentVideoIndex]) {
        navigate(`/videos/${videos[currentVideoIndex].id}`);
      }
    }
  };

  return (
    <div className="App">
      <Header />
      <center className="Home-main">
        <div className="video-container" id="video-container" onScroll={handleScroll}>
          {videos.map((data) => (
            <Video
              key={data.id}
              url={data.videoUrl}
              username={data.username}
              profile={data.profile}
              likes={data.likes}
              comment={data.commentCount}
              share={data.shareCount}
            />
          ))}
          {loading && <div>Loading...</div>}
        </div>
      </center>
    </div>
  );
};

export default SingleVideo;
