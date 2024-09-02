import React, { useEffect, useState, useCallback, useRef } from 'react';
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
  const navigate = useNavigate();
  const lastScrollTop = useRef(0);
  const scrollTimeout = useRef(null);

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

  const handleScroll = useCallback(() => {
    const videoContainer = document.getElementById('video-container');
    if (videoContainer) {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      scrollTimeout.current = setTimeout(() => {
        const scrollTop = videoContainer.scrollTop;
        const isScrollingDown = scrollTop > lastScrollTop.current;
        const videoHeight = window.innerHeight;
        const scrollThreshold = videoHeight / 2; // Adjust this threshold as needed

        lastScrollTop.current = scrollTop;

        // Change video only if scrolling down and significant scroll distance
        if (isScrollingDown && Math.abs(scrollTop - lastScrollTop.current) > scrollThreshold) {
          const currentVideoIndex = Math.round(scrollTop / videoHeight);
          if (videos[currentVideoIndex]) {
            navigate(`/videos/${videos[currentVideoIndex].id}`);
          }
        }

        // Load more videos when nearing the bottom
        if (isScrollingDown && videoContainer.scrollHeight - scrollTop === videoContainer.clientHeight) {
          getData(lastVisible);
        }
      }, 200); // Debounce timeout of 200ms, adjust as needed
    }
  }, [videos, lastVisible, navigate]);

  useEffect(() => {
    const videoContainer = document.getElementById('video-container');
    if (videoContainer) {
      videoContainer.addEventListener('scroll', handleScroll);
      return () => videoContainer.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  return (
    <div className="App">
      <Header />
      <center className="Home-main">
        <div className="video-container" id="video-container">
          {videos.map((data) => (
            <div className="video-item" key={data.id}>
              <Video
                url={data.videoUrl}
                username={data.username}
                profile={data.profile}
                likes={data.likes}
                comment={data.commentCount}
                share={data.shareCount}
              />
            </div>
          ))}
          {loading && <div>Loading...</div>}
        </div>
      </center>
    </div>
  );
};

export default SingleVideo;
