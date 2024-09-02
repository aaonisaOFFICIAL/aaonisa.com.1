import React, { useRef, useState, useEffect, Suspense } from "react";
import Header from "../Header/Header";
import "./Video.css";
import Footer from "../Footer/Footer";
import Sidebar from "../Sidebar/Sidebar";
import NavigateFooter from "../NavigateFooter/NavigateFooter";

export default function Video({
  url,
  username,
  likes,
  comment,
  share,
  profile,
}) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const vidRef = useRef();

  const openModalHandler = () => setOpenModal(!openModal);

  const onVideoClick = () => {
    if (isVideoPlaying) {
      vidRef.current.pause();
      setIsVideoPlaying(false);
    } else {
      vidRef.current.play();
      setIsVideoPlaying(true);
    }
  };

  useEffect(() => {
    const scroll = document.getElementById("video-container");

    const playVideo = () => {
        if (vidRef.current && isVideoVisible()) {
            vidRef.current.play();
        } else if (vidRef.current) {
            vidRef.current.pause();
        }
    };

    const isVideoVisible = () => {
        if (vidRef.current) {
            const rect = vidRef.current.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.bottom <=
                (window.innerHeight || document.documentElement.clientHeight)
            );
        }
        return false;
    };

    // Initial play when component mounts
    playVideo();

    // Set up event listener for scrolling
    if (scroll) {
        scroll.addEventListener("scroll", playVideo);
    }

    // Cleanup event listener on component unmount
    return () => {
        if (scroll) {
            scroll.removeEventListener("scroll", playVideo);
        }
    };
}, [isVideoPlaying]);


  return (
    <Suspense fallback={<div style={{ color: "#000" }}>Loading...</div>}>
      <div className="video-cards">
        <div className="video-heading">
          <div className="video-contant">
            <img src={profile} alt="Profile" />
            <p>{username}</p>
          </div>
          <div>
            <a href="https://play.google.com/store/apps/details?id=com.aaonisaalive">
              <button className="video-btn">Follow</button>
            </a>
          </div>
        </div>
        <video
          onClick={onVideoClick}
          className="video-player"
          ref={vidRef}
          src={url}
          loop
          autoPlay
        />
        <div className="sidebar">
          <Sidebar likes={likes} comments={comment} share={share} />
        </div>
        {/* <Footer profile={profile} username={username} /> */}
        <div className="open-modal">
          <NavigateFooter />
        </div>
      </div>
    </Suspense>
  );
}
