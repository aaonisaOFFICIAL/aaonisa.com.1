import React, { useEffect, useState, useRef } from 'react';
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
  const [hasMore, setHasMore] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRefs = useRef([]);

  const getData = async (startAtDoc = null) => {
    if (loading || !hasMore) return; // Prevent multiple calls
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

      setVideos((prevVideos) => [initialVideo, ...prevVideos, ...additionalVideos]);
      setLastVisible(additionalVideosSnapshot.docs[additionalVideosSnapshot.docs.length - 1]);

      // Check if we've loaded fewer videos than requested; if so, no more videos are available
      if (additionalVideos.length < 9) setHasMore(false);
    } else {
      setVideos((prevVideos) => [...prevVideos, ...fetchedVideos]);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);

      // Check if we've loaded fewer videos than requested; if so, no more videos are available
      if (fetchedVideos.length < 10) setHasMore(false);
    }

    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [id]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = videoRefs.current.indexOf(entry.target);
            if (videos[index] && videos[index].id !== id) {
              navigate(`/videos/${videos[index].id}`);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.7, // Adjust this to determine how much of the video should be visible
      }
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => {
      videoRefs.current.forEach((video) => {
        if (video) observer.unobserve(video);
      });
    };
  }, [videos, id]);

  const handleScroll = () => {
    const videoContainer = document.getElementById('video-container');
    if (videoContainer) {
      const scrollPosition = videoContainer.scrollTop + videoContainer.offsetHeight;
      const height = videoContainer.scrollHeight;

      if (scrollPosition >= height - 200 && hasMore && !loading) {
        getData(lastVisible);
      }
    }
  };

  return (
    <div className="App">
      <Header />
      <center className="Home-main">
        <div className="video-container" id="video-container" onScroll={handleScroll}>
          {videos.map((data, index) => (
            <Video
              key={data.id}
              url={data.videoUrl}
              username={data.username}
              profile={data.profile}
              likes={data.likes}
              comment={data.commentCount}
              share={data.shareCount}
              ref={(el) => (videoRefs.current[index] = el)}
            />
          ))}
          {loading && <div>Loading...</div>}
          {!hasMore && <div>No more videos to load</div>}
        </div>
      </center>
    </div>
  );
};

export default SingleVideo;
