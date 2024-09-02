import React, { lazy, useEffect, useState } from 'react';
import { query, collection, getDocs, where, orderBy, limit, startAfter } from 'firebase/firestore';
import { db } from '../../config';
import Header from '../Header/Header';

const LazyVideo = lazy(() => import('../Video/Video'));

const Home = () => {
  const [data, setData] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const getData = async (startAtDoc = null) => {
    if (loading) return;
    setLoading(true);

    const videosRef = collection(db, 'videos');
    let q;

    if (startAtDoc) {
      q = query(
        videosRef,
        where('type', '==', 'video'),
        orderBy('date'),
        startAfter(startAtDoc), // Use startAfter instead of startAt
        limit(10)
      );
    } else {
      q = query(
        videosRef,
        where('type', '==', 'video'),
        orderBy('date'),
        limit(10)
      );
    }

    const querySnapshot = await getDocs(q);
    const videosData = querySnapshot.docs.map((doc) => doc.data());

    setData((prevData) => [...prevData, ...videosData]);
    setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
    setLoading(false);

    if (querySnapshot.docs.length < 10) {
      setHasMore(false);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      const videosRef = collection(db, 'videos');
      const initialQuery = query(
        videosRef,
        where('type', '==', 'video'),
        orderBy('date')
      );
      const initialSnapshot = await getDocs(initialQuery);
      const randomIndex = Math.floor(Math.random() * initialSnapshot.docs.length);
      const randomDoc = initialSnapshot.docs[randomIndex];

      getData(randomDoc);
    };

    fetchInitialData();
  }, []);

  const handleScroll = () => {
    const videoContainer = document.getElementById('video-container');
    if (videoContainer) {
      const scrollPosition = videoContainer.scrollTop + videoContainer.offsetHeight;
      const height = videoContainer.scrollHeight;

      if (scrollPosition >= height - 200 && hasMore) {
        getData(lastVisible);
      }
    }
  };

  return (
    <div className="App">
      <Header />
      <center className="Home-main">
        <div className="video-container" id="video-container" onScroll={handleScroll}>
          {data.map((video) => (
            <LazyVideo
              key={video.id}
              url={video.videoUrl}
              username={video.username}
              profile={video.profile}
              likes={video.likes}
              comment={video.commentCount}
              share={video.shareCount}
            />
          ))}
          {loading && <div>Loading...</div>}
        </div>
      </center>
    </div>
  );
};

export default Home;
