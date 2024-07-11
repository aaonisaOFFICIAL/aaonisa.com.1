import React, { lazy, useEffect, useState, Suspense } from "react";
import { Route, Router, Routes } from "react-router-dom";
import "./App.css";
import Home from "./components/Home/Home";
import SingleVideo from "./components/SingleVideo/SingleVideo";
import { Privacy } from "./Privacy";
import { Term } from "./Term";
import { Support } from "./Support";


export default function App() {
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/videos/:id" element={<SingleVideo />}/>
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/term" element={<Term />} />
        <Route path="/support" element={<Support />} />
      </Routes>
      {/* <Home /> */}
    </>
    
  );
}
