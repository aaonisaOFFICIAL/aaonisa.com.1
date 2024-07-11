import React, { lazy, useEffect, useState } from 'react';
import { query, collection, getDocs, where, orderBy, limit, startAfter } from "firebase/firestore";
import { db } from "../../config";
import Header from '../Header/Header';

const LazyVideo = lazy(() => import("../Video/Video"));

const Home = () => {
  const [data, setData] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const getData = async () => {
    if (loading) return;
    setLoading(true);

    const videosRef = collection(db, "videos");
    const q = query(
      videosRef,
      where("type", "==", "video"),
      orderBy("date"),
      startAfter(lastVisible), // Start after the last visible document
      limit(10) // Load 10 more videos
    );
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
    getData();
  }, []);

  const handleScroll = () => {
    const videoContainer = document.getElementById("video-container");
    if (videoContainer) {
      const scrollPosition = videoContainer.scrollTop + videoContainer.offsetHeight;
      const height = videoContainer.scrollHeight;

      if (scrollPosition >= height - 200 && hasMore) {
        getData();
      }
    }
  };

  return (
    <div className="App">
      <Header />
      <center className='Home-main'>
        <div className="video-container" id="video-container" onScroll={handleScroll}>
          {data.map((video, index) => (
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